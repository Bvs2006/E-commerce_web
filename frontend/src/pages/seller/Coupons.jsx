import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: '',
    minPurchase: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/coupons/seller/my-coupons');
      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/coupons', formData);
      if (response.data.success) {
        alert('Coupon created successfully!');
        setShowForm(false);
        setFormData({ code: '', discountType: 'percentage', discountAmount: '', minPurchase: '', expiryDate: '' });
        fetchCoupons();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const response = await axios.delete(`/api/coupons/${id}`);
        if (response.data.success) {
          setCoupons(coupons.filter(c => c._id !== id));
        }
      } catch (err) {
        alert('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="flex flex-between items-center mb-lg">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Coupons & Offers</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage discount codes for your customers.</p>
        </div>
        <div className="flex gap-sm">
          <Link to="/seller/dashboard" className="btn btn-outline">Back</Link>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Coupon'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-lg" style={{ padding: '2rem' }}>
          <h3 className="mb-md">Create New Coupon</h3>
          <form onSubmit={handleSubmit} className="grid grid-2 gap-md">
            <div className="form-group">
              <label className="block mb-xs font-bold">Coupon Code</label>
              <input
                type="text"
                name="code"
                required
                placeholder="e.g. SAVE20"
                value={formData.code}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-xs font-bold">Discount Type</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block mb-xs font-bold">Discount Value</label>
              <input
                type="number"
                name="discountAmount"
                required
                value={formData.discountAmount}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-xs font-bold">Min Purchase (₹)</label>
              <input
                type="number"
                name="minPurchase"
                value={formData.minPurchase}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="block mb-xs font-bold">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="btn btn-primary">Create Coupon</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Available Coupons ({coupons.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center' }}>Loading coupons...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '1rem' }}>Code</th>
                  <th style={{ padding: '1rem' }}>Discount</th>
                  <th style={{ padding: '1rem' }}>Expiry</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length > 0 ? coupons.map((coupon) => (
                  <tr key={coupon._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ padding: '0.25rem 0.5rem', background: '#f1f5f9', color: 'var(--primary)', borderRadius: '4px', display: 'inline-block', fontWeight: 'bold', fontFamily: 'monospace' }}>
                        {coupon.code}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                      {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `₹${coupon.discountAmount}`}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        color: coupon.isActive ? 'green' : 'red',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div className="flex gap-sm justify-end">
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'red', borderColor: 'red' }}
                          onClick={() => handleDelete(coupon._id)}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupons;
