const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./db');
const verifyToken = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Register API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Provide username and password' });

    const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('REGISTER ERROR:', err); // Terminal ma error print thase
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 2. Login API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error('LOGIN ERROR:', err); // Terminal ma error print thase
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 3. Get Tasks API (Protected)
app.get('/api/tasks', verifyToken, async (req, res) => {
  try {
    const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
    res.json(tasks);
  } catch (err) {
    console.error('GET TASKS ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 4. Create Task API (Protected)
app.post('/api/tasks', verifyToken, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    await db.query(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [req.user.id, title, description || '', status || 'To Do']
    );
    res.status(201).json({ message: 'Task created successfully' });
  } catch (err) {
    console.error('CREATE TASK ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 5. Update Task API (Protected)
app.put('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (tasks.length === 0) return res.status(404).json({ message: 'Task not found' });

    await db.query(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
      [title, description, status, id]
    );
    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('UPDATE TASK ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 6. Delete Task API (Protected)
app.delete('/api/tasks/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (tasks.length === 0) return res.status(404).json({ message: 'Task not found' });

    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('DELETE TASK ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);