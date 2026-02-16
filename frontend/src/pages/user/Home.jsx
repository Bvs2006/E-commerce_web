import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import Hero from '../../components/user/Hero';
import { useWishlist } from '../../context/WishlistContext';

const Home = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-center" style={{ minHeight: '400px' }}>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Hero />

      <div className="container">
        <div className="flex flex-between mb-lg items-end">
          <div>
            <h2 style={{ fontSize: '2rem' }}>Featured Products</h2>
            <p style={{ color: 'var(--text-muted)' }}>Check out our latest arrivals.</p>
          </div>
          <Link to="/shop" className="btn btn-outline">
            View All Products
          </Link>
        </div>

        <div className="grid grid-4 gap-md mb-xl">
          {products.slice(0, 8).map((product) => (
            <div key={product._id}>
              <Link to={`/product/${product._id}`} className="card flex flex-col h-full" style={{ padding: 0 }}>
                <div style={{ position: 'relative', height: '240px', backgroundColor: '#f1f5f9' }}>
                  <img
                    src={product.images[0]?.url || '/placeholder.png'}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product._id);
                    }}
                    style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'white', border: 'none', borderRadius: '50%',
                      width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      zIndex: 2, fontSize: '1.2rem',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {isInWishlist(product._id) ? '❤️' : '🤍'}
                  </button>
                </div>

                <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="flex flex-between items-start mb-xs">
                    <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '600' }}>{product.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>★ {product.rating}</span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', flexGrow: 1 }}>
                    {product.description.substring(0, 60)}...
                  </p>

                  <div className="flex flex-between items-center mt-auto">
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                      ₹{product.price.toLocaleString()}
                    </span>
                    <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
