import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Wishlist = () => {
  const { addToCart } = useCart();
  const { wishlist: wishlistItems, toggleWishlist, loading } = useWishlist();

  const removeItem = (id) => {
    toggleWishlist(id);
  };

  const handleMoveToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="flex flex-between items-center mb-lg">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Wishlist</h1>
          <p style={{ color: 'var(--text-muted)' }}>You have {wishlistItems.length} items saved.</p>
        </div>
        <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-4 gap-md">
          {wishlistItems.map((item) => (
            <div key={item._id} className="card" style={{ padding: 0 }}>
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={item.images?.[0]?.url || '/placeholder.png'}
                  alt={item.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
                <button
                  onClick={() => removeItem(item._id)}
                  style={{
                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                    background: 'white', border: '1px solid #ddd', borderRadius: '50%',
                    width: '28px', height: '28px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: 'red'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ padding: '1rem' }}>
                <div className="flex flex-between mb-xs">
                  <span className="badge badge-primary">{item.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'green' }}>{item.stock}</span>
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>{item.name}</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>₹{item.price.toLocaleString()}</p>

                <div className="flex flex-col gap-sm">
                  <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => handleMoveToCart(item)}>
                    Add to Cart
                  </button>
                  <Link to={`/product/${item._id}`} className="btn btn-outline btn-sm" style={{ textAlign: 'center' }}>
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Browse our shop and add products to your wishlist.
          </p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
