import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="d-flex">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <i className="bi bi-people-fill me-2"></i>Intern Portal
        </div>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="bi bi-speedometer2"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/interns" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="bi bi-person-lines-fill"></i> Interns
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="bi bi-check2-square"></i> Tasks
            </NavLink>
          </li>
        </ul>
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #1e293b' }}>
          <button className="btn btn-sm btn-outline-secondary w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left me-1"></i> Logout
          </button>
        </div>
      </aside>
      <div className="main-content flex-grow-1">
        <div className="topbar">
          <span className="fw-semibold text-secondary" style={{ fontSize: '0.9rem' }}>
            Intern Management Portal
          </span>
          <span className="badge bg-primary">
            <i className="bi bi-person-circle me-1"></i>{username}
          </span>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;