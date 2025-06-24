import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { registerUser } from '../services/authFetch.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/me/dashboard" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      const res = await registerUser(form);
      const token = res.data.token;
      localStorage.setItem('token', token);
      login(token);
      navigate('/me/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'danger');
      if (err.statusCode === 422 && err.data) {
        setFieldErrors(err.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-2">🎬 MovieBox</h2>
        <p className="text-center text-muted mb-4">Create your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
              <input name="firstName" className="form-control" value={form.firstName} onChange={handleChange} required />
            </div>
            {fieldErrors.firstName && <div className="text-danger small">{fieldErrors.firstName[0]}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
              <input name="lastName" className="form-control" value={form.lastName} onChange={handleChange} required />
            </div>
            {fieldErrors.lastName && <div className="text-danger small">{fieldErrors.lastName[0]}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>
            {fieldErrors.email && <div className="text-danger small">{fieldErrors.email[0]}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
              <input name="phoneNumber" className="form-control" value={form.phoneNumber} onChange={handleChange} />
            </div>
            {fieldErrors.phoneNumber && <div className="text-danger small">{fieldErrors.phoneNumber[0]}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
              <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
            </div>
            {fieldErrors.password && <div className="text-danger small">{fieldErrors.password[0]}</div>}
          </div>

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">Already have an account? <a href="/login">Login</a></small>
        </div>
      </div>
    </div>
  );
};

export default Register;
