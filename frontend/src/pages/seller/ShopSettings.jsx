import { useState } from 'react';
import { Link } from 'react-router-dom';

const ShopSettings = () => {
  const [shopData, setShopData] = useState({
    name: 'My Online Shop',
    description: 'A simple online store for quality products.',
    email: 'shop@example.com',
    phone: '+91 0000000000',
    address: 'Street Name, City, State'
  });

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="flex flex-between items-center mb-lg">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Shop Settings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Update your shop information.</p>
        </div>
        <Link to="/seller/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <aside>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '8px', background: '#f1f5f9',
              margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', border: '1px solid var(--border)'
            }}>
              🏢
            </div>
            <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>Change Icon</button>
          </div>
        </aside>

        <main>
          <div className="card mb-lg">
            <h4 style={{ marginBottom: '1rem' }}>General Information</h4>
            <div className="grid gap-md">
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Shop Name</label>
                <input
                  type="text"
                  value={shopData.name}
                  onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Shop Description</label>
                <textarea
                  rows="4"
                  value={shopData.description}
                  onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '1rem' }}>Contact Details</h4>
            <div className="grid grid-2 gap-md">
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email</label>
                <input type="email" value={shopData.email} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Phone</label>
                <input type="text" value={shopData.phone} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Address</label>
                <input type="text" value={shopData.address} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Save Changes</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShopSettings;
