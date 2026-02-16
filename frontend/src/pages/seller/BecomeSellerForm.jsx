import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BecomeSellerForm = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    shopName: '',
    shopPhone: '',
    shopAddress: '',
    shopGST: '',
    shopDescription: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/seller/apply', formData);
      if (response.data.success) {
        updateUser(response.data.user);
        alert('Application submitted! Administrators will review your request.');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem' }}>Become a Seller</h1>
          <p style={{ color: 'var(--text-muted)' }}>Register your shop to start selling on Emporium.</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && (
            <div style={{ color: 'red', background: '#fee2e2', padding: '10px', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Shop Name</label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                placeholder="Enter your shop name"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
              <input
                type="tel"
                required
                value={formData.shopPhone}
                onChange={(e) => setFormData({ ...formData, shopPhone: e.target.value })}
                placeholder="Business contact number"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Shop Address</label>
              <input
                type="text"
                required
                value={formData.shopAddress}
                onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                placeholder="Full address of your shop"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>GST Number</label>
              <input
                type="text"
                required
                value={formData.shopGST}
                onChange={(e) => setFormData({ ...formData, shopGST: e.target.value })}
                placeholder="Enter GSTIN"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>About Your Shop</label>
              <textarea
                required
                value={formData.shopDescription}
                onChange={(e) => setFormData({ ...formData, shopDescription: e.target.value })}
                placeholder="Briefly describe what you plan to sell..."
                rows="4"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
              ></textarea>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', color: '#64748b', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0 }}>By applying, you agree to our seller terms and conditions and the platform commission fee.</p>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Application'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default BecomeSellerForm;
