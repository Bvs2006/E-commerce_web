import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const metrics = [
    { label: 'Total Sales', value: '₹12,84,500', icon: '💰' },
    { label: 'Total Users', value: '1,240', icon: '👥' },
    { label: 'Sellers', value: '86', icon: '🏪' },
    { label: 'Pending', value: '14', icon: '🛡️' },
  ];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <aside>
          <div className="card" style={{ padding: '1rem', backgroundColor: '#1e293b', color: 'white' }}>
            <div className="flex flex-col items-center mb-lg">
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%', background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                color: 'white', fontWeight: 'bold', marginBottom: '10px'
              }}>
                A
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'white' }}>Admin Panel</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Control Panel</p>
            </div>

            <nav className="flex flex-col gap-sm">
              <button
                className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`}
                style={{ justifyContent: 'flex-start', border: 'none', background: activeTab === 'overview' ? 'var(--primary)' : 'transparent', color: 'white' }}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <Link to="/admin/users" className="btn" style={{ justifyContent: 'flex-start', border: 'none', color: 'rgba(255,255,255,0.8)' }}>
                Users
              </Link>
              <Link to="/admin/sellers" className="btn" style={{ justifyContent: 'flex-start', border: 'none', color: 'rgba(255,255,255,0.8)' }}>
                Sellers
              </Link>
              <Link to="/admin/products" className="btn" style={{ justifyContent: 'flex-start', border: 'none', color: 'rgba(255,255,255,0.8)' }}>
                Products
              </Link>
              <Link to="/admin/orders" className="btn" style={{ justifyContent: 'flex-start', border: 'none', color: 'rgba(255,255,255,0.8)' }}>
                Orders
              </Link>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main>
          <div className="flex flex-between mb-lg">
            <div>
              <h2 style={{ fontSize: '1.8rem' }}>Admin Dashboard</h2>
              <p style={{ color: 'var(--text-muted)' }}>Manage your application and users.</p>
            </div>
          </div>

          <div className="grid grid-4 mb-lg">
            {metrics.map((metric, i) => (
              <div key={i} className="card">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 0 5px 0' }}>{metric.label}</p>
                <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{metric.value}</h4>
              </div>
            ))}
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h4 style={{ marginBottom: '1rem' }}>System Health</h4>
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '4px' }}>
                <div className="flex flex-between mb-sm">
                  <span style={{ fontSize: '0.85rem' }}>Database</span>
                  <span style={{ fontSize: '0.85rem', color: 'green' }}>Online</span>
                </div>
                <div className="flex flex-between mb-sm">
                  <span style={{ fontSize: '0.85rem' }}>Storage</span>
                  <span style={{ fontSize: '0.85rem', color: 'green' }}>Stable</span>
                </div>
                <div className="flex flex-between">
                  <span style={{ fontSize: '0.85rem' }}>Server API</span>
                  <span style={{ fontSize: '0.85rem', color: 'green' }}>Online</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 style={{ marginBottom: '1rem' }}>Admin Notes</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Total 14 pending seller applications need review. Please check the seller approvals section.
              </p>
              <Link to="/admin/sellers" className="btn btn-outline btn-sm mt-md" style={{ fontSize: '0.8rem' }}>Review Sellers</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
