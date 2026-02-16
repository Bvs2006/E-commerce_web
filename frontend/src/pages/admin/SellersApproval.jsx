import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SellersApproval = () => {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/seller/admin/pending');
      if (response.data.success) {
        setPendingSellers(response.data.sellers);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending applications');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    const status = action === 'Approve' ? 'approved' : 'rejected';
    try {
      const response = await axios.put(`/api/seller/admin/${id}/status`, { status });
      if (response.data.success) {
        alert(`Seller application ${status} successfully`);
        setPendingSellers(pendingSellers.filter(s => s._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} seller`);
    }
  };

  if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="flex flex-between items-center mb-lg">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Seller Approvals</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review pending seller applications.</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      {error && (
        <div style={{ color: 'var(--danger)', background: '#fee2e2', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0 }}>Applications ({pendingSellers.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem' }}>Shop Name</th>
                <th style={{ padding: '1rem' }}>Owner</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSellers.length > 0 ? pendingSellers.map((seller) => (
                <tr key={seller._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{seller.shopName}</td>
                  <td style={{ padding: '1rem' }}>{seller.name}</td>
                  <td style={{ padding: '1rem' }}>{seller.email}</td>
                  <td style={{ padding: '1rem' }}>{new Date(seller.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div className="flex gap-sm justify-end">
                      <button
                        onClick={() => handleAction(seller._id, 'Approve')}
                        className="btn btn-primary btn-sm"
                        style={{ background: 'green' }}
                      >Approve</button>
                      <button
                        onClick={() => handleAction(seller._id, 'Reject')}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'red', borderColor: 'red' }}
                      >Reject</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No pending applications.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellersApproval;
