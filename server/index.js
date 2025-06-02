const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');  // Required to wrap Express for Lambda

const {
  getUsers,
  addUser,
  getProjects,
  addProject,
} = require('./db'); // Make sure this file exists and exports the expected functions

const app = express();
const VALID_TOKEN = 'portal-token';  // Simple hardcoded token auth

app.use(cors());
app.use(express.json());

// In-memory storage for demo
const cases = [];
let nextId = 1;

// --- Auth Middleware ---
function auth(req, res, next) {
  if (req.headers.authorization === `Bearer ${VALID_TOKEN}`) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

// --- Login Route ---
app.post('/portal/login', (req, res) => {
  const { username, password } = req.body;
  const user = getUsers().find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    return res.json({ token: VALID_TOKEN });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// --- Case Management ---
app.post('/portal/cases', auth, (req, res) => {
  const { description } = req.body;
  const newCase = { id: nextId++, description, status: 'open' };
  cases.push(newCase);
  res.status(201).json(newCase);
});

app.get('/portal/cases', auth, (req, res) => {
  res.json(cases);
});

app.put('/portal/cases/:id', auth, (req, res) => {
  const { id } = req.params;
  const caseItem = cases.find((c) => c.id === parseInt(id, 10));
  if (!caseItem) {
    return res.status(404).json({ error: 'Case not found' });
  }
  const { description, status } = req.body;
  if (description !== undefined) caseItem.description = description;
  if (status !== undefined) caseItem.status = status;
  res.json(caseItem);
});

app.delete('/portal/cases/:id', auth, (req, res) => {
  const { id } = req.params;
  const index = cases.findIndex((c) => c.id === parseInt(id, 10));
  if (index === -1) {
    return res.status(404).json({ error: 'Case not found' });
  }
  cases.splice(index, 1);
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

// --- Test Route ---
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// --- Lambda-compatible export ---
module.exports.handler = serverless(app);
