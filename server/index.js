const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const crypto = require('crypto');

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
} = require('./db');

const app = express();
const tokens = new Map();

app.use(cors());
app.use(express.json());

// --- Auth Middleware ---
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
app.post('/portal/signup', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'username, password and role required' });
  }
  const existing = getUsers().find((u) => u.username === username);
  if (existing) {
    return res.status(400).json({ error: 'username taken' });
  }
  const user = addUser({ username, password, role });
  res.status(201).json({ id: user.id });
});

// --- Login Route ---
app.post('/portal/login', (req, res) => {
  const { username, password } = req.body;

  // --- Hardcoded test user ---
  if (username === 'testuser' && password === 'testpass') {
    const testUser = { id: 0, username: 'testuser', role: 'admin' };
    const token = crypto.randomBytes(16).toString('hex');
    tokens.set(token, testUser);
    return res.json({ token, role: testUser.role });
  }

  // --- Regular user lookup ---
  const user = getUsers().find(
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
app.post('/portal/cases', auth, (req, res) => {
  const { clinCheckId, photos, link } = req.body;
  const newCase = {
    userId: req.user.id,
    clinCheckId,
    photos: photos || [],
    link: link || '',
    status: 'open',
    createdAt: Date.now(),
  };
  res.status(201).json(addCase(newCase));
});

app.get('/portal/cases', auth, (req, res) => {
  let all = getCases();
  if (req.user.role === 'dentist') {
    all = all.filter((c) => c.userId === req.user.id);
  }
  res.json(all);
});

app.get('/portal/cases/:id', auth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const c = getCase(id);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }
  if (req.user.role === 'dentist' && c.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(c);
});

app.post('/portal/cases/:id/assign', auth, (req, res) => {
  if (req.user.role !== 'specialist') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const id = parseInt(req.params.id, 10);
  const c = getCase(id);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }
  if (c.assignedTo && c.assignedTo !== req.user.id) {
    return res.status(400).json({ error: 'Case already assigned' });
  }
  updateCase(id, { assignedTo: req.user.id, status: 'assigned' });
  res.json({ assignedTo: req.user.id });
});

app.get('/portal/queue', auth, (req, res) => {
  if (req.user.role !== 'specialist') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const queue = getCases().filter((c) => !c.assignedTo);
  res.json(queue);
});

app.post('/portal/cases/:id/review', auth, (req, res) => {
  if (req.user.role !== 'specialist') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const id = parseInt(req.params.id, 10);
  const c = getCase(id);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }
  const { notes, statements } = req.body;
  const review = addReview({
    caseId: id,
    specialistId: req.user.id,
    notes: notes || '',
    statements: statements || [],
    createdAt: Date.now(),
  });
  updateCase(id, { status: 'reviewed' });
  res.status(201).json(review);
});

app.get('/portal/reviews/:caseId', auth, (req, res) => {
  const caseId = parseInt(req.params.caseId, 10);
  const c = getCase(caseId);
  if (!c) {
    return res.status(404).json({ error: 'Case not found' });
  }
  if (req.user.role === 'dentist' && c.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const list = getReviewsForCase(caseId);
  res.json(list);
});


app.put('/portal/cases/:id', auth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = updateCase(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Case not found' });
  }
  res.json(updated);
});

app.delete('/portal/cases/:id', auth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!deleteCase(id)) {
    return res.status(404).json({ error: 'Case not found' });
  }
  res.status(204).end();
});

// --- User and Project Management ---
app.get('/users', (req, res) => {
  res.json(getUsers());
});

app.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  const user = addUser({ username, password });
  res.status(201).json(user);
});

app.get('/projects', (req, res) => {
  res.json(getProjects());
});

app.post('/projects', (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name required' });
  }
  const project = addProject({ name, description: description || '' });
  res.status(201).json(project);
});

app.get('/projects/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const proj = getProject(id);
  if (!proj) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(proj);
});

app.put('/projects/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = updateProject(id, req.body);
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
