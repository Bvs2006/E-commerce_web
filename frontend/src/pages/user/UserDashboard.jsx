import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const { user, isSeller, isSellerPending, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get('/api/orders/my-orders');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const response = await axios.put('/api/auth/profile', profileData);
      if (response.data.success) {
        alert('Profile updated successfully!');
        setUser({ ...user, ...profileData });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const stats = [
    { label: 'Orders', value: orders.length || '0', icon: '📦' },
    { label: 'Wishlist', value: user?.wishlist?.length || '0', icon: '❤️' },
    { label: 'Total Spent', value: '₹' + orders.reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString(), icon: '💰' },
    { label: 'Credits', value: '₹500', icon: '🎫' },
  ];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <aside>
          <div className="card">
            <div className="flex flex-col items-center mb-lg">
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%', background: '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                color: 'var(--primary)', fontWeight: 'bold', marginBottom: '10px'
              }}>
                {user?.name?.charAt(0)}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{user?.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user?.email}</p>
            </div>

            <nav className="flex flex-col gap-sm">
              <button
                className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'flex-start', border: activeTab === 'overview' ? '' : '1px solid #ddd' }}
                onClick={() => setActiveTab('overview')}
              >
                Dashboard
              </button>
              <button
                className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'flex-start', border: activeTab === 'orders' ? '' : '1px solid #ddd' }}
                onClick={() => setActiveTab('orders')}
              >
                My Orders
              </button>
              <button
                className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'flex-start', border: activeTab === 'profile' ? '' : '1px solid #ddd' }}
                onClick={() => setActiveTab('profile')}
              >
                Profile Settings
              </button>
              <Link to="/wishlist" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: '1px solid #ddd' }}>
                Wishlist
              </Link>
            </nav>

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              {isSeller ? (
                <Link to="/seller/dashboard" className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem' }}>
                  Seller Dashboard
                </Link>
              ) : isSellerPending ? (
                <div style={{ background: '#fef3c7', color: '#92400e', padding: '0.5rem', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem' }}>
                  Application Pending
                </div>
              ) : (
                <Link to="/become-seller" className="btn btn-outline" style={{ width: '100%', fontSize: '0.9rem' }}>
                  Become a Seller
                </Link>
              )}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main>
          <div className="mb-lg">
            <h2 style={{ fontSize: '1.8rem' }}>Welcome, {user?.name}</h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage your personal account and orders here.</p>
          </div>

          {activeTab === 'overview' && (
            <>
              <div className="grid grid-4 mb-lg">
                {stats.map((stat, i) => (
                  <div key={i} className="card flex items-center gap-md">
                    <div style={{ fontSize: '1.5rem' }}>{stat.icon}</div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>{stat.label}</p>
                      <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{stat.value}</h4>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-2">
                <div className="card">
                  <h4 style={{ marginBottom: '1rem' }}>Recent Orders</h4>
                  {ordersLoading ? (
                    <p style={{ textAlign: 'center', padding: '1rem' }}>Loading...</p>
                  ) : orders.length > 0 ? (
                    <div className="flex flex-col gap-sm">
                      {orders.slice(0, 3).map(order => (
                        <div key={order._id} style={{ padding: '0.75rem', borderBottom: '1px solid #eee', fontSize: '0.85rem' }}>
                          <div className="flex flex-between">
                            <span className="font-bold">Order #{order._id.substring(0, 8)}</span>
                            <span className="badge badge-primary">{order.orderStatus}</span>
                          </div>
                          <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                            ₹{order.totalPrice.toLocaleString()} • {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      <button onClick={() => setActiveTab('orders')} className="text-primary font-bold mt-sm" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.85rem' }}>View All Orders →</button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                      <p>No recent orders found.</p>
                      <Link to="/shop" className="btn btn-outline btn-sm mt-md" style={{ fontSize: '0.8rem' }}>Start Shopping</Link>
                    </div>
                  )}
                </div>

                <div className="card">
                  <h4 style={{ marginBottom: '1rem' }}>Shipping Address</h4>
                  <div style={{ fontSize: '0.9rem' }}>
                    <p className="font-bold">{user?.name}</p>
                    {user?.shopAddress ? (
                      <p style={{ color: 'var(--text-muted)' }}>{user.shopAddress}</p>
                    ) : (
                      <p style={{ color: 'var(--text-muted)' }}>
                        123 Main Street<br />
                        City Name, State<br />
                        500001, India
                      </p>
                    )}
                    <button onClick={() => setActiveTab('profile')} className="text-primary mt-md" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.85rem' }}>Edit Details</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>My Orders</h3>
              {ordersLoading ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>Loading your orders...</p>
              ) : orders.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Order ID</th>
                        <th style={{ padding: '1rem' }}>Date</th>
                        <th style={{ padding: '1rem' }}>Total</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                        <th style={{ padding: '1rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '1rem' }}>#{order._id.substring(0, 8)}</td>
                          <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '1rem' }}>₹{order.totalPrice.toLocaleString()}</td>
                          <td style={{ padding: '1rem' }}>
                            <span className="badge badge-primary">{order.orderStatus}</span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <Link to={`/orders/${order._id}`} className="text-primary font-bold">Details</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You haven't placed any orders yet.</p>
                  <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Profile Settings</h3>
              <form onSubmit={handleUpdateProfile} className="grid gap-md" style={{ maxWidth: '500px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
