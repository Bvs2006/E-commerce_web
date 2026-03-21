import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ShopSettings = () => {
  const { user, setUser } = useAuth();
  const [shopData, setShopData] = useState({
    name: user?.shopName || '',
    description: user?.shopDescription || '',
    email: user?.email || '',
    phone: user?.shopPhone || '',
    address: user?.shopAddress || '',
    gst: user?.shopGST || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put('/api/seller/shop-settings', {
        shopName: shopData.name,
        shopDescription: shopData.description,
        shopPhone: shopData.phone,
        shopAddress: shopData.address,
        shopGST: shopData.gst
      });

      if (response.data.success) {
        alert('✅ Shop settings updated successfully!');
        setUser({
          ...user,
          shopName: shopData.name,
          shopDescription: shopData.description,
          shopPhone: shopData.phone,
          shopAddress: shopData.address,
          shopGST: shopData.gst
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update shop settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="flex flex-between items-center mb-lg">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Shop Settings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Update your shop information.</p>
        </div>
        <Link to="/seller/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      <form onSubmit={handleSave} className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <aside>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '8px', background: '#f1f5f9',
              margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', border: '1px solid var(--border)'
            }}>
              🏢
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Shop Brand Icon</p>
            <button type="button" className="btn btn-outline btn-sm" style={{ width: '100%' }}>Change Icon</button>
          </div>
        </aside>

        <main>
          <div className="card mb-lg">
            <h4 style={{ marginBottom: '1rem' }}>General Information</h4>
            <div className="grid gap-md">
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>Shop Name</label>
                <input
                  type="text"
                  value={shopData.name}
                  onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>Shop Description</label>
                <textarea
                  rows="4"
                  value={shopData.description}
                  onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical' }}
                  placeholder="Tell customers about your shop..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '1rem' }}>Contact & Legal</h4>
            <div className="grid grid-2 gap-md">
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>Email (Personal)</label>
                <input type="email" value={shopData.email} disabled style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #eee', background: '#f8fafc', cursor: 'not-allowed' }} title="Change email in Profile settings" />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>Support Phone</label>
                <input
                  type="text"
                  value={shopData.phone}
                  onChange={(e) => setShopData({ ...shopData, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                  placeholder="+91..."
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>GST Number</label>
                <input
                  type="text"
                  value={shopData.gst}
                  onChange={(e) => setShopData({ ...shopData, gst: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '500' }}>Shop Address</label>
                <input
                  type="text"
                  value={shopData.address}
                  onChange={(e) => setShopData({ ...shopData, address: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                  placeholder="Complete business address..."
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </main>
      </form>
    </div>
  );
};

export default ShopSettings;
