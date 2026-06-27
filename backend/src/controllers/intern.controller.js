const pool = require('../config/db');
const { validationResult } = require('express-validator');

exports.getInterns = async (req, res) => {
  const { department, search } = req.query;
  let query = 'SELECT * FROM interns WHERE 1=1';
  const params = [];

  if (department) {
    params.push(department);
    query += ` AND department = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    query += ` AND name ILIKE $${params.length}`;
  }

  query += ' ORDER BY created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getInternById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM interns WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Intern not found.' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createIntern = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, department, joining_date } = req.body;

  try {
    const exists = await pool.query('SELECT id FROM interns WHERE email = $1', [email]);
    if (exists.rows.length > 0) return res.status(409).json({ message: 'Email already exists.' });

    const result = await pool.query(
      'INSERT INTO interns (name, email, department, joining_date) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email, department, joining_date]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateIntern = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, department, joining_date } = req.body;

  try {
    const result = await pool.query(
      'UPDATE interns SET name=$1, email=$2, department=$3, joining_date=$4 WHERE id=$5 RETURNING *',
      [name, email, department, joining_date, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Intern not found.' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteIntern = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM interns WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Intern not found.' });
    res.json({ message: 'Intern deleted.' });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateAttendance = async (req, res) => {
  const { attendance } = req.body;
  try {
    const result = await pool.query(
      'UPDATE interns SET attendance=$1 WHERE id=$2 RETURNING *',
      [attendance, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Intern not found.' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};