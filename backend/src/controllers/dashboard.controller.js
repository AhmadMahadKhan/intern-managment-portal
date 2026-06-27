const pool = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [interns, tasks, completed, pending, byDept, byStatus] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM interns'),
      pool.query('SELECT COUNT(*) FROM tasks'),
      pool.query("SELECT COUNT(*) FROM tasks WHERE status='Completed'"),
      pool.query("SELECT COUNT(*) FROM tasks WHERE status='Pending'"),
      pool.query('SELECT department, COUNT(*) as count FROM interns GROUP BY department'),
      pool.query('SELECT status, COUNT(*) as count FROM tasks GROUP BY status'),
    ]);

    res.json({
      totalInterns: parseInt(interns.rows[0].count),
      totalTasks: parseInt(tasks.rows[0].count),
      completedTasks: parseInt(completed.rows[0].count),
      pendingTasks: parseInt(pending.rows[0].count),
      internsByDepartment: byDept.rows,
      tasksByStatus: byStatus.rows,
    });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};