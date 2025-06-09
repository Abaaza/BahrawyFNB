const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUsers, addUser } = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const SALT_ROUNDS = 10;

// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ error: 'name, email, password and role required' });
  }
  if (!['dentist', 'specialist'].includes(role)) {
    return res.status(400).json({ error: 'invalid role' });
  }
  const existing = getUsers().find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'email already registered' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = addUser({ name, email, passwordHash, role });
    return res.status(201).json({ id: user.id });
  } catch (err) {
    return res.status(500).json({ error: 'registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }
  const user = getUsers().find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  try {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ token, role: user.role });
  } catch (err) {
    return res.status(500).json({ error: 'login failed' });
  }
});

module.exports = { router, JWT_SECRET };
