import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 800, color: '#2563eb' }}>404</h1>
      <p className="text-secondary mb-3">Page not found.</p>
      <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
    </div>
  );
}

export default NotFound;