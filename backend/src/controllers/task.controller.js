const pool = require('../config/db');
const { validationResult } = require('express-validator');

exports.getTasks = async (req, res) => {
  const { status, intern_id } = req.query;
  let query = `
    SELECT t.*, i.name AS intern_name, i.department 
    FROM tasks t 
    LEFT JOIN interns i ON t.intern_id = i.id 
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    params.push(status);
    query += ` AND t.status = $${params.length}`;
  }
  if (intern_id) {
    params.push(intern_id);
    query += ` AND t.intern_id = $${params.length}`;
  }

  query += ' ORDER BY t.created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { intern_id, title, description, status } = req.body;

  try {
    const intern = await pool.query('SELECT id FROM interns WHERE id=$1', [intern_id]);
    if (intern.rows.length === 0) return res.status(404).json({ message: 'Intern not found.' });

    const result = await pool.query(
      'INSERT INTO tasks (intern_id, title, description, status) VALUES ($1,$2,$3,$4) RETURNING *',
      [intern_id, title, description || null, status || 'Pending']
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateTask = async (req, res) => {
  const { status, title, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tasks SET status=COALESCE($1,status), title=COALESCE($2,title), description=COALESCE($3,description) WHERE id=$4 RETURNING *',
      [status || null, title || null, description || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Task not found.' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};