import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { internAPI } from '../services/api';

const DEPARTMENTS = ['All', 'HR', 'IT', 'Marketing', 'Finance', 'Others'];

function getDeptColor(dept) {
  const map = { IT: '#2563eb', HR: '#10b981', Marketing: '#f59e0b', Finance: '#8b5cf6', Others: '#64748b' };
  return map[dept] || '#64748b';
}

function InternList() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [attendanceId, setAttendanceId] = useState(null);

  const fetchInterns = useCallback(() => {
    setLoading(true);
    const params = {};
    if (dept !== 'All') params.department = dept;
    if (search.trim()) params.search = search.trim();
    internAPI.getAll(params)
      .then((res) => setInterns(res.data))
      .catch(() => setError('Failed to load interns.'))
      .finally(() => setLoading(false));
  }, [dept, search]);

  useEffect(() => {
    const timer = setTimeout(fetchInterns, 300);
    return () => clearTimeout(timer);
  }, [fetchInterns]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this intern? All associated tasks will be removed.')) return;
    setDeletingId(id);
    try {
      await internAPI.delete(id);
      setInterns((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert('Failed to delete intern.');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAttendance = async (intern) => {
    setAttendanceId(intern.id);
    try {
      const res = await internAPI.updateAttendance(intern.id, !intern.attendance);
      setInterns((prev) => prev.map((i) => (i.id === intern.id ? res.data : i)));
    } catch {
      alert('Failed to update attendance.');
    } finally {
      setAttendanceId(null);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-bold mb-0">Intern Management</h5>
        <Link to="/interns/add" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg me-1"></i>Add Intern
        </Link>
      </div>

      <div className="card-panel mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select className="form-select" value={dept} onChange={(e) => setDept(e.target.value)}>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setSearch(''); setDept('All'); }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : interns.length === 0 ? (
        <div className="card-panel text-center py-5 text-secondary">
          <i className="bi bi-person-x" style={{ fontSize: '2.5rem' }}></i>
          <p className="mt-2 mb-0">No interns found.</p>
        </div>
      ) : (
        <div className="card-panel p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th className="ps-3">Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Joining Date</th>
                  <th>Attendance</th>
                  <th className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern) => (
                  <tr key={intern.id}>
                    <td className="ps-3 fw-semibold">{intern.name}</td>
                    <td className="text-secondary" style={{ fontSize: '0.88rem' }}>{intern.email}</td>
                    <td>
                      <span className="badge badge-dept" style={{ background: getDeptColor(intern.department) + '18', color: getDeptColor(intern.department) }}>
                        {intern.department}
                      </span>
                    </td>
                    <td className="text-secondary" style={{ fontSize: '0.88rem' }}>
                      {new Date(intern.joining_date).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${intern.attendance ? 'btn-success' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '0.75rem', minWidth: 80 }}
                        onClick={() => toggleAttendance(intern)}
                        disabled={attendanceId === intern.id}
                      >
                        {attendanceId === intern.id
                          ? <span className="spinner-border spinner-border-sm"></span>
                          : intern.attendance ? <><i className="bi bi-check2"></i> Present</> : 'Absent'
                        }
                      </button>
                    </td>
                    <td className="text-end pe-3">
                      <Link to={`/interns/edit/${intern.id}`} className="btn btn-sm btn-outline-primary me-1">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(intern.id)}
                        disabled={deletingId === intern.id}
                      >
                        {deletingId === intern.id
                          ? <span className="spinner-border spinner-border-sm"></span>
                          : <i className="bi bi-trash"></i>
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default InternList;