import React, { useEffect, useState, useCallback } from 'react';
import { taskAPI, internAPI } from '../services/api';

const STATUS_OPTIONS = ['Pending', 'Completed'];

function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ intern_id: '', title: '', description: '', status: 'Pending' });
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTasks = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filterStatus) params.status = filterStatus;
    taskAPI.getAll(params)
      .then((res) => setTasks(res.data))
      .catch(() => setError('Failed to load tasks.'))
      .finally(() => setLoading(false));
  }, [filterStatus]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    internAPI.getAll()
      .then((res) => setInterns(res.data))
      .catch(() => {});
  }, []);

  const validateForm = () => {
    const e = {};
    if (!form.intern_id) e.intern_id = 'Select an intern.';
    if (!form.title.trim()) e.title = 'Task title is required.';
    return e;
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await taskAPI.create(form);
      setForm({ intern_id: '', title: '', description: '', status: 'Pending' });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    setUpdatingId(task.id);
    try {
      const res = await taskAPI.update(task.id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: res.data.status } : t)));
    } catch {
      alert('Failed to update task status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Completed') return <span className="badge" style={{ background: '#10b98118', color: '#10b981' }}>Completed</span>;
    return <span className="badge" style={{ background: '#f59e0b18', color: '#f59e0b' }}>Pending</span>;
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-bold mb-0">Task Management</h5>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <i className={`bi ${showForm ? 'bi-x' : 'bi-plus-lg'} me-1`}></i>
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {showForm && (
        <div className="card-panel mb-4">
          <h6 className="fw-semibold mb-3">New Task</h6>
          {formError && <div className="alert alert-danger py-2" style={{ fontSize: '0.88rem' }}>{formError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Intern</label>
                <select className={`form-select ${formErrors.intern_id ? 'is-invalid' : ''}`} name="intern_id" value={form.intern_id} onChange={handleFormChange}>
                  <option value="">Select intern</option>
                  {interns.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.department})</option>)}
                </select>
                {formErrors.intern_id && <div className="invalid-feedback">{formErrors.intern_id}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Title</label>
                <input className={`form-control ${formErrors.title ? 'is-invalid' : ''}`} name="title" value={form.title} onChange={handleFormChange} placeholder="Task title" />
                {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Description</label>
                <textarea className="form-control" name="description" value={form.description} onChange={handleFormChange} rows={2} placeholder="Optional description" />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Status</label>
                <select className="form-select" name="status" value={form.status} onChange={handleFormChange}>
                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? <><span className="spinner-border spinner-border-sm me-1"></span>Saving...</> : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card-panel mb-3">
        <div className="d-flex gap-2 align-items-center">
          <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Filter:</span>
          <button className={`btn btn-sm ${filterStatus === '' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilterStatus('')}>All</button>
          <button className={`btn btn-sm ${filterStatus === 'Pending' ? 'btn-warning text-dark' : 'btn-outline-warning'}`} onClick={() => setFilterStatus('Pending')}>Pending</button>
          <button className={`btn btn-sm ${filterStatus === 'Completed' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilterStatus('Completed')}>Completed</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : tasks.length === 0 ? (
        <div className="card-panel text-center py-5 text-secondary">
          <i className="bi bi-clipboard-x" style={{ fontSize: '2.5rem' }}></i>
          <p className="mt-2 mb-0">No tasks found.</p>
        </div>
      ) : (
        <div className="card-panel p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th className="ps-3">Title</th>
                  <th>Intern</th>
                  <th>Department</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-end pe-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="ps-3 fw-semibold">{task.title}</td>
                    <td>{task.intern_name || '—'}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{task.department || '—'}</span>
                    </td>
                    <td className="text-secondary" style={{ fontSize: '0.85rem', maxWidth: 180 }}>
                      <span className="text-truncate d-block" style={{ maxWidth: 160 }}>{task.description || '—'}</span>
                    </td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td className="text-end pe-3">
                      {updatingId === task.id ? (
                        <span className="spinner-border spinner-border-sm text-primary"></span>
                      ) : task.status === 'Pending' ? (
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleStatusChange(task, 'Completed')}>
                          <i className="bi bi-check2"></i> Mark Done
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleStatusChange(task, 'Pending')}>
                          <i className="bi bi-arrow-counterclockwise"></i> Reopen
                        </button>
                      )}
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

export default TaskManagement;