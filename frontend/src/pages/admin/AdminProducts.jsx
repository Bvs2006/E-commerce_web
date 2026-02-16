import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products?limit=100');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? As an admin, this action is final.')) {
      try {
        const response = await axios.delete(`/api/products/${id}`);
        if (response.data.success) {
          setProducts(products.filter(p => p._id !== id));
        }
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="flex flex-between items-center mb-lg">
        <div>
          <h1 style={{ fontSize: '2rem' }}>All Products</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all product listings on the platform.</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      {error && <div className="alert alert-danger mb-md">{error}</div>}

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0 }}>Active Listings ({products.length})</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem' }}>Product Name</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Seller</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div className="flex items-center gap-sm">
                      <div style={{ width: '30px', height: '30px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                        <img
                          src={product.images?.[0]?.url || '/placeholder.png'}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{product._id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{product.price.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>{product.seller?.shopName || product.seller?.name || 'Unknown'}</td>
                  <td style={{ padding: '1rem' }}>{product.category}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div className="flex gap-sm justify-end">
                      <Link to={`/product/${product._id}`} className="btn btn-outline btn-sm">View</Link>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: 'red', borderColor: 'red' }}
                        onClick={() => handleDelete(product._id)}
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No products found in the catalog.
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

export default AdminProducts;
