import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { internAPI } from '../services/api';

const DEPARTMENTS = ['IT', 'HR', 'Marketing', 'Finance', 'Others'];

function EditIntern() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', email: '', department: '', joining_date: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    internAPI.getById(id)
      .then((res) => {
        const d = res.data;
        setForm({
          name: d.name,
          email: d.email,
          department: d.department,
          joining_date: d.joining_date?.split('T')[0] || '',
        });
      })
      .catch(() => setServerError('Failed to load intern data.'))
      .finally(() => setFetching(false));
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.department) e.department = 'Department is required.';
    if (!form.joining_date) e.joining_date = 'Joining date is required.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await internAPI.update(id, form);
      navigate('/interns');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update intern.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/interns" className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-arrow-left"></i>
        </Link>
        <h5 className="fw-bold mb-0">Edit Intern</h5>
      </div>

      <div className="card-panel" style={{ maxWidth: 560 }}>
        {serverError && <div className="alert alert-danger py-2">{serverError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Full Name</label>
            <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} name="name" value={form.name} onChange={handleChange} />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Email</label>
            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" value={form.email} onChange={handleChange} />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Department</label>
            <select className={`form-select ${errors.department ? 'is-invalid' : ''}`} name="department" value={form.department} onChange={handleChange}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            {errors.department && <div className="invalid-feedback">{errors.department}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Joining Date</label>
            <input type="date" className={`form-control ${errors.joining_date ? 'is-invalid' : ''}`} name="joining_date" value={form.joining_date} onChange={handleChange} />
            {errors.joining_date && <div className="invalid-feedback">{errors.joining_date}</div>}
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-1"></span>Saving...</> : 'Save Changes'}
            </button>
            <Link to="/interns" className="btn btn-outline-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditIntern;