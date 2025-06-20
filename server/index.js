require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const puppeteer = require('puppeteer');
const connectMongo = require('./mongoConnect');

const { router: authRouter } = require('./auth');
const authenticate = require('./authMiddleware');

const {
  getUsers,
  addUser,
  getUser,
  getProjects,
  getProject,
  addProject,
  updateProject,
  getCases,
  addCase,
  updateCase,
  deleteCase,
  getCase,
  getReviews,
  addReview,
  getReviewsForCase,
  getReview,
  updateReview,
  addBooking,
  getBookingsForSpecialist,
} = require('./db');
const { generateDraftReport } = require('./draftReportService');

const {
  sendCaseReady,
  sendNewRequest,
  sendBookingConfirmation,
} = require('./notificationService');

// JWT-based auth middleware
const requireAuth = authenticate();

const app = express();
const tokens = new Map();
connectMongo();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    const allowed = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
});

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT || undefined,
  credentials: process.env.S3_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      }
    : undefined,
});
const BUCKET = process.env.S3_BUCKET;
const PUBLIC_URL = process.env.S3_PUBLIC_URL;

app.post('/api/uploads/photos', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const ext = path.extname(req.file.originalname);
  const key = `uploads/${crypto.randomUUID()}${ext}`;
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );
    const base =
      PUBLIC_URL || `https://${BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`;
    res.json({ photoUrl: `${base}/${key}` });
  } catch (err) {
    console.error('Upload error', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// --- Auth Routes (JWT based) ---
app.use('/auth', authRouter);

// Example protected route using JWT middleware
app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user.role}` });
});

// --- Auth Middleware (legacy Map based for /portal routes) ---
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  const user = tokens.get(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = user;
  return next();
}



// --- Signup Route ---
app.post('/portal/signup', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'username, password and role required' });
  }
  const users = await getUsers();
  const existing = users.find((u) => u.username === username);
  if (existing) {
    return res.status(400).json({ error: 'username taken' });
  }
  const user = await addUser({ username, password, role });
  res.status(201).json({ id: user._id });
});

// --- Login Route ---
app.post('/portal/login', async (req, res) => {
  const { username, password } = req.body;

  // --- Hardcoded test user ---
  if (username === 'testuser' && password === 'testpass') {
    const testUser = { id: 0, username: 'testuser', role: 'admin' };
    const token = crypto.randomBytes(16).toString('hex');
    tokens.set(token, testUser);
    return res.json({ token, role: testUser.role });
  }

  // --- Regular user lookup ---
  const users = await getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = crypto.randomBytes(16).toString('hex');
  tokens.set(token, user);
  res.json({ token, role: user.role });
});

// --- Case Management ---
app.post('/portal/cases', auth, async (req, res) => {
  const { clinCheckId, photos, files, link } = req.body;
  const newCase = {
    userId: req.user.id,
    clinCheckId,
    photos: photos || [],
    files: files || [],
    link: link || '',
    status: 'received',
    createdAt: Date.now(),
  };
  const created = await addCase(newCase);
  res.status(201).json(created);
});

app.get('/portal/cases', auth, async (req, res) => {
  let all = await getCases();
  if (req.user.role === 'dentist') {
    all = all.filter((c) => c.userId === req.user.id);
  }
  res.json(all);
});

app.get('/portal/cases/:id', auth, async (req, res) => {
  const id = req.params.id;
  const c = await getCase(id);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }
  if (req.user.role === 'dentist' && c.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(c);
});

app.post('/portal/cases/:id/assign', auth, async (req, res) => {
  if (req.user.role !== 'specialist') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const id = req.params.id;
  const c = await getCase(id);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }
  if (c.assignedTo && c.assignedTo !== req.user.id) {
    return res.status(400).json({ error: 'Case already assigned' });
  }
  await updateCase(id, { assignedTo: req.user.id, status: 'in_progress' });
  res.json({ assignedTo: req.user.id });
});

app.get('/portal/queue', auth, async (req, res) => {
  if (req.user.role !== 'specialist') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const queue = (await getCases()).filter((c) => !c.assignedTo);
  res.json(queue);
});

app.post('/portal/cases/:id/review', auth, async (req, res) => {
  if (req.user.role !== 'specialist') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const id = req.params.id;
  const c = await getCase(id);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }
  const { notes, statements } = req.body;
  const review = await addReview({
    caseId: id,
    specialistId: req.user.id,
    notes: notes || '',
    statements: statements || [],
    createdAt: Date.now(),
  });
  await updateCase(id, { status: 'report_ready' });
  res.status(201).json(review);
});

app.get('/portal/reviews/:caseId', auth, async (req, res) => {
  const caseId = req.params.caseId;
  const c = await getCase(caseId);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }
  if (req.user.role === 'dentist' && c.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const list = await getReviewsForCase(caseId);
  res.json(list);
});


app.put('/portal/cases/:id', auth, async (req, res) => {
  const id = req.params.id;
  const updated = await updateCase(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Case not found' });
  }
  res.json(updated);
});

app.delete('/portal/cases/:id', auth, async (req, res) => {
  const id = req.params.id;
  if (!(await deleteCase(id))) {
    return res.status(404).json({ error: 'Case not found' });
  }
  res.status(204).end();
});

// --- User and Project Management ---
app.get('/users', async (req, res) => {
  const list = await getUsers();
  res.json(list);
});

app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  const user = await addUser({ username, password });
  res.status(201).json(user);
});

app.get('/projects', async (req, res) => {
  const projects = await getProjects();
  res.json(projects);
});

app.post('/projects', async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name required' });
  }
  const project = await addProject({ name, description: description || '' });
  res.status(201).json(project);
});

app.get('/projects/:id', async (req, res) => {
  const id = req.params.id;
  const proj = await getProject(id);
  if (!proj) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(proj);
});

app.put('/projects/:id', async (req, res) => {
  const id = req.params.id;
  const updated = await updateProject(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(updated);
});

// --- Case Status Update API ---
app.put('/api/cases/:id/status', async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  if (!['received', 'in_progress', 'report_ready'].includes(status)) {
    return res.status(400).json({ error: 'invalid status' });
  }
  const existing = await getCase(id);
  if (!existing) {
    return res.status(404).json({ error: 'Case not found' });
  }
  const updated = await updateCase(id, { status });
  try {
    if (status === 'received' && updated.assignedTo) {
      const spec = await getUser(updated.assignedTo);
      if (spec && spec.email) {
        await sendNewRequest(spec.email, updated._id.toString());
      }
    }
    if (status === 'report_ready') {
      const dentist = await getUser(updated.userId);
      if (dentist && dentist.email) {
        await sendCaseReady(dentist.email, updated._id.toString());
      }
    }
  } catch (err) {
    console.error('Notification error:', err.message);
  }
  res.json(updated);
});

app.post('/api/generate-draft-report', async (req, res) => {
  try {
    const report = await generateDraftReport(req.body);
    res.json(report);
  } catch (err) {
    console.error('Draft report error:', err.message);
    res.status(500).json({ error: 'Failed to generate draft report' });
  }
});

app.post('/api/reviews/:id/export', async (req, res) => {
  const id = req.params.id;
  try {
    const review = await getReview(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const html = `<!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>Review ${id}</title></head>
        <body>
          <h1>Review ${id}</h1>
          <p>${review.notes || ''}</p>
          <ul>${(review.statements || []).map((s) => `<li>${s}</li>`).join('')}</ul>
        </body>
      </html>`;

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const key = `pdfs/${id}-${Date.now()}.pdf`;
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
      })
    );
    const base =
      PUBLIC_URL || `https://${BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`;
    const pdfUrl = `${base}/${key}`;
    const updated = await updateReview(id, { pdfUrl });
    res.json({ pdfUrl, review: updated });
  } catch (err) {
    console.error('Export error', err);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
});

// --- Booking APIs ---
app.get('/api/bookings/availability', async (req, res) => {
  const { specialistId, start, end } = req.query;
  if (!specialistId || !start || !end) {
    return res.status(400).json({ error: 'specialistId, start and end required' });
  }
  const bookings = await getBookingsForSpecialist(specialistId, start, end);
  const startDate = new Date(start);
  const endDate = new Date(end);
  const slots = [];
  for (let d = new Date(startDate); d < endDate; d.setHours(d.getHours() + 1)) {
    if (d.getHours() < 9 || d.getHours() >= 17) continue;
    const conflict = bookings.some((b) => new Date(b.datetime).getTime() === d.getTime());
    if (!conflict) {
      slots.push(new Date(d).toISOString());
    }
  }
  res.json({ slots });
});

app.post('/api/bookings', async (req, res) => {
  const { dentistId, specialistId, datetime } = req.body;
  if (!dentistId || !specialistId || !datetime) {
    return res.status(400).json({ error: 'dentistId, specialistId and datetime required' });
  }
  const existing = await getBookingsForSpecialist(specialistId, datetime, new Date(new Date(datetime).getTime() + 1));
  if (existing.length) {
    return res.status(400).json({ error: 'Slot already booked' });
  }
  const booking = await addBooking({ dentistId, specialistId, datetime });
  try {
    const dentist = await getUser(dentistId);
    const specialist = await getUser(specialistId);
    await sendBookingConfirmation(dentist?.email, specialist?.email, datetime);
  } catch (err) {
    console.error('Booking email error:', err.message);
  }
  res.status(201).json(booking);
});


// --- Test Route ---
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// --- Export for serverless ---
module.exports.handler = serverless(app);

// --- Local development support ---
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}
