import { useState, useEffect } from 'react';
import { authGet, authPut } from '../services/authFetch.js';
import { useToast } from '../contexts/ToastContext.jsx';

const Profile = () => {
    const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const { showToast } = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = await authGet('/users/me');
            if (user) {
                setForm({
                    firstName: user.data.firstName || '',
                    lastName: user.data.lastName || '',
                    phoneNumber: user.data.phoneNumber || '',
                    email: user.data.email || '',
                });
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authPut('/users/me', form);
            setForm({
                firstName: res.data.firstName || '',
                lastName: res.data.lastName || '',
                phoneNumber: res.data.phoneNumber || '',
                email: res.data.email || '',
            });
            setFieldErrors({});
            showToast('Profile updated successfully');
        } catch (err) {
            showToast(err.message || 'Profile update failed', 'danger');
            if (err.statusCode === 422) {
                setFieldErrors(err.data);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h4 className="mb-4 text-primary">👤 Edit Profile</h4>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email (Read Only)</label>
                                    <input type="email" name="email" className="form-control" value={form.email} disabled />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">First Name</label>
                                    <input name="firstName" className="form-control" value={form.firstName} onChange={handleChange} />
                                    {fieldErrors.firstName && <div className="text-danger small">{fieldErrors.firstName[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Last Name</label>
                                    <input name="lastName" className="form-control" value={form.lastName} onChange={handleChange} />
                                    {fieldErrors.lastName && <div className="text-danger small">{fieldErrors.lastName[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input name="phoneNumber" className="form-control" value={form.phoneNumber} onChange={handleChange} />
                                    {fieldErrors.phoneNumber && <div className="text-danger small">{fieldErrors.phoneNumber[0]}</div>}
                                </div>

                                <div className="d-grid">
                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
