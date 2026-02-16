import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user, isSeller, isSellerPending } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Orders', value: '12', icon: '📦' },
    { label: 'Wishlist', value: '8', icon: '❤️' },
    { label: 'Total Spent', value: '₹24,500', icon: '💰' },
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
                Profile
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
                  <h4 style={{ marginBottom: '1rem' }}>Recent Activity</h4>
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                    <p>No recent orders found.</p>
                    <Link to="/shop" className="btn btn-outline btn-sm mt-md" style={{ fontSize: '0.8rem' }}>Start Shopping</Link>
                  </div>
                </div>

                <div className="card">
                  <h4 style={{ marginBottom: '1rem' }}>Shipping Address</h4>
                  <div style={{ fontSize: '0.9rem' }}>
                    <p className="font-bold">{user?.name}</p>
                    <p style={{ color: 'var(--text-muted)' }}>
                      123 Main Street<br />
                      City Name, State<br />
                      500001, India
                    </p>
                    <button className="text-primary mt-md" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.85rem' }}>Edit Address</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'overview' && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>This section is under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
