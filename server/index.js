const express = require('express');
const cors = require('cors');

const {
  getUsers,
  addUser,
  getProjects,
  addProject,
} = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simple in-memory case storage

const cases = [];
let nextId = 1;
const VALID_TOKEN = 'portal-token';

app.post('/portal/login', (req, res) => {
  const { username, password } = req.body;
  const user = getUsers().find(
    (u) => u.username === username && u.password === password
  );
  if (user) {    return res.json({ token: VALID_TOKEN });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

function auth(req, res, next) {
  if (req.headers.authorization === `Bearer ${VALID_TOKEN}`) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

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

// --- User and Project Endpoints ---
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


app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});