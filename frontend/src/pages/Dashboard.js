import React, { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { dashboardAPI } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card">
      <div className="icon-box" style={{ background: color + '18' }}>
        <i className={`bi ${icon}`} style={{ color }}></i>
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value ?? '—'}</div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardAPI.getStats()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: 300 }}>
      <div className="spinner-border text-primary"></div>
    </div>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;

  const deptLabels = stats.internsByDepartment.map((d) => d.department);
  const deptCounts = stats.internsByDepartment.map((d) => parseInt(d.count));

  const statusLabels = stats.tasksByStatus.map((s) => s.status);
  const statusCounts = stats.tasksByStatus.map((s) => parseInt(s.count));

  const doughnutData = {
    labels: statusLabels,
    datasets: [{
      data: statusCounts,
      backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const barData = {
    labels: deptLabels,
    datasets: [{
      label: 'Interns',
      data: deptCounts,
      backgroundColor: COLORS,
      borderRadius: 6,
    }],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  return (
    <div>
      <h5 className="fw-bold mb-4">Dashboard Overview</h5>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatCard label="Total Interns" value={stats.totalInterns} icon="bi-people-fill" color="#2563eb" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard label="Total Tasks" value={stats.totalTasks} icon="bi-list-task" color="#8b5cf6" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard label="Completed" value={stats.completedTasks} icon="bi-check-circle-fill" color="#10b981" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard label="Pending" value={stats.pendingTasks} icon="bi-hourglass-split" color="#f59e0b" />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-5">
          <div className="card-panel h-100">
            <h6 className="fw-semibold mb-3">Tasks by Status</h6>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
        <div className="col-md-7">
          <div className="card-panel h-100">
            <h6 className="fw-semibold mb-3">Interns by Department</h6>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;