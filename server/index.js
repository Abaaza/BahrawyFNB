require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const crypto = require('crypto');
const connectMongo = require('./mongoConnect');

const { router: authRouter } = require('./auth');
const authenticate = require('./authMiddleware');

const {
  getUsers,
  addUser,
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
} = require('./db');

// JWT-based auth middleware
const requireAuth = authenticate();

const app = express();
const tokens = new Map();
connectMongo();
app.use(cors());
app.use(express.json());

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
  const { clinCheckId, photos, link } = req.body;
  const newCase = {
    userId: req.user.id,
    clinCheckId,
    photos: photos || [],
    link: link || '',
    status: 'open',
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
  await updateCase(id, { assignedTo: req.user.id, status: 'assigned' });
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
  await updateCase(id, { status: 'reviewed' });
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
