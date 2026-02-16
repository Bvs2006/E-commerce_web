import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    earnings: 0,
    productsCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        axios.get('/api/seller/dashboard'),
        axios.get('/api/order/seller/my-orders')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching seller dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Sales', value: `₹${stats.totalSales.toLocaleString()}`, icon: '💰' },
    { label: 'Product Count', value: stats.productsCount.toString(), icon: '📦' },
    { label: 'Orders', value: stats.totalOrders.toString(), icon: '⏳' },
    { label: 'Net Earnings', value: `₹${stats.earnings.toLocaleString()}`, icon: '⭐' },
  ];

  if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <aside>
          <div className="card" style={{ padding: '1rem', backgroundColor: '#334155', color: 'white' }}>
            <div className="flex flex-col items-center mb-lg">
              <div style={{
                width: '70px', height: '70px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                color: 'white', fontWeight: 'bold', marginBottom: '10px'
              }}>
                {user?.shopName?.charAt(0) || user?.name?.charAt(0)}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'white' }}>{user?.shopName}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Seller Panel</p>
            </div>

            <nav className="flex flex-col gap-sm">
              <button
                className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`}
                style={{ justifyContent: 'flex-start', border: 'none', background: activeTab === 'overview' ? 'var(--primary)' : 'transparent', color: 'white' }}
                onClick={() => setActiveTab('overview')}
              >
                Dashboard
              </button>
              <Link to="/seller/products" className="btn" style={{ justifyContent: 'flex-start', border: 'none', color: 'rgba(255,255,255,0.8)' }}>
                Products
              </Link>
              <Link to="/seller/orders" className="btn" style={{ justifyContent: 'flex-start', border: 'none', color: 'rgba(255,255,255,0.8)' }}>
                Orders
              </Link>
              <Link to="/seller/settings" className="btn" style={{ justifyContent: 'flex-start', border: 'none', color: 'rgba(255,255,255,0.8)' }}>
                Settings
              </Link>
            </nav>

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Link to="/dashboard" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', display: 'block' }}>
                Back to Personal
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main>
          <div className="flex flex-between mb-lg">
            <div>
              <h2 style={{ fontSize: '1.8rem' }}>Seller Dashboard</h2>
              <p style={{ color: 'var(--text-muted)' }}>Overview of your shop status.</p>
            </div>
            <Link to="/seller/products" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              Manage Products
            </Link>
          </div>

          <div className="grid grid-4 mb-lg">
            {statCards.map((stat, i) => (
              <div key={i} className="card">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 0 5px 0' }}>{stat.label}</p>
                <h4 style={{ fontSize: '1.25rem', margin: 0 }}>{stat.value}</h4>
              </div>
            ))}
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '1rem' }}>Recent Orders</h4>
            <div style={{ overflowX: 'auto' }}>
              {recentOrders.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Order ID</th>
                      <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Customer</th>
                      <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Amount</th>
                      <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem 0' }}>#{order._id.slice(-6).toUpperCase()}</td>
                        <td style={{ padding: '0.75rem 0' }}>{order.user?.name}</td>
                        <td style={{ padding: '0.75rem 0' }}>₹{order.totalPrice}</td>
                        <td style={{ padding: '0.75rem 0' }}>
                          <span style={{ fontSize: '0.75rem', color: order.orderStatus === 'Delivered' ? 'green' : 'orange' }}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>No orders yet.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
