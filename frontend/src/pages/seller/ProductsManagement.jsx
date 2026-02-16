import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Fashion',
    stock: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products/seller/my-products');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      alert('You can only upload up to 3 images');
      return;
    }

    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (images.length === 0) {
        alert('Please upload at least one image');
        return;
      }

      setLoading(true);

      const base64Images = await Promise.all(
        images.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      if (isNaN(Number(formData.price)) || isNaN(Number(formData.stock))) {
        alert('Please enter valid numbers for price and stock');
        return;
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: base64Images
      };

      console.log('Sending product data:', { ...productData, images: `${productData.images.length} images` });

      const response = await axios.post('/api/products', productData);
      if (response.data.success) {
        alert('Product added successfully!');
        setShowForm(false);
        setFormData({ name: '', description: '', price: '', category: 'Fashion', stock: '' });
        setImages([]);
        setImagePreviews([]);
        fetchMyProducts();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`/api/products/${id}`);
        if (response.data.success) {
          setProducts(products.filter(p => p._id !== id));
        }
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="flex flex-between items-center mb-lg">
        <div>
          <h1 style={{ fontSize: '2rem' }}>My Products</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your shop inventory and listings.</p>
        </div>
        <div className="flex gap-sm">
          <Link to="/seller/dashboard" className="btn btn-outline">Back</Link>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-lg" style={{ padding: '2rem' }}>
          <h3 className="mb-md">Add New Product</h3>
          <form onSubmit={handleSubmit} className="grid grid-2 gap-md">
            <div className="form-group">
              <label className="block mb-xs font-bold">Product Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-xs font-bold">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              >
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Beauty">Beauty</option>
                <option value="Toys">Toys</option>
                <option value="Automotive">Automotive</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block mb-xs font-bold">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
            </div>
            <div className="form-group">
              <label className="block mb-xs font-bold">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="block mb-xs font-bold">Product Images (Up to 3)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
              <div className="flex gap-sm mt-sm">
                {imagePreviews.map((url, i) => (
                  <div key={i} style={{ width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="block mb-xs font-bold">Description</label>
              <textarea
                name="description"
                required
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              ></textarea>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex gap-sm">
            <button className="btn btn-primary btn-sm">All Products</button>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing {products.length} products
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <p style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '1rem' }}>Product</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Stock</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map((product) => (
                  <tr key={product._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div className="flex items-center gap-sm">
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
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
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: product.stock < 1 ? 'red' : 'inherit' }}>{product.stock} units</span>
                    </td>
                    <td style={{ padding: '1rem' }}>{product.category}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div className="flex gap-sm justify-end">
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'red', borderColor: 'red' }}
                          onClick={() => handleDelete(product._id)}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No products found. Add your first product above.
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

export default ProductsManagement;
