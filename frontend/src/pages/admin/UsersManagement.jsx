import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/admin/all');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`/api/user/admin/${id}`);
        if (response.data.success) {
          setUsers(users.filter(u => u._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="flex flex-between items-center mb-lg">
        <div>
          <h1 style={{ fontSize: '2rem' }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all user accounts and roles.</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      {error && <div className="alert alert-danger mb-md">{error}</div>}

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex gap-sm">
            <button className="btn btn-primary btn-sm">All Users ({users.length})</button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Seller Status</th>
                <th style={{ padding: '1rem' }}>Joined</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      {user.roles?.join(', ') || 'user'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: user.sellerStatus === 'approved' ? '#dcfce7' : (user.sellerStatus === 'pending' ? '#fef9c3' : '#f1f5f9'),
                      color: user.sellerStatus === 'approved' ? '#15803d' : (user.sellerStatus === 'pending' ? '#854d0e' : '#475569')
                    }}>
                      {user.sellerStatus || 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div className="flex gap-sm justify-end">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'red', borderColor: 'red', fontSize: '0.75rem', padding: '2px 8px' }}
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users found.
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

export default UsersManagement;
