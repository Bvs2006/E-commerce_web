import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 500;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)', textAlign: 'center' }}>
        <div className="card animate-fade" style={{ padding: 'var(--space-xl) 0' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your Cart is <span className="text-gradient">Empty</span></h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            It looks like you haven't added anything to your cart yet. Explore our luxury collections and find something extraordinary.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">Back to Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-xl)' }}>
      <h1 className="mb-xl animate-fade" style={{ fontSize: '3rem' }}>Shopping <span className="text-gradient">Cart</span></h1>

      <div className="grid animate-fade" style={{ gridTemplateColumns: '1fr 380px', gap: 'var(--space-xl)', animationDelay: '0.1s' }}>
        {/* Cart Items */}
        <div className="flex flex-col gap-md">
          {cartItems.map((item) => (
            <div key={item._id} className="card flex gap-lg" style={{ padding: '1.25rem' }}>
              <div style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <img
                  src={item.images?.[0]?.url || item.image || '/placeholder.png'}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex flex-between items-start">
                    <div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Category: {item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-danger"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="flex flex-between items-end">
                  <div className="flex items-center gap-md">
                    <div className="flex items-center" style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      <button
                        className="p-sm"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', width: '35px' }}
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >-</button>
                      <span style={{ width: '40px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                      <button
                        className="p-sm"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', width: '35px' }}
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Unit Price: ₹{item.price.toLocaleString()}</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: '800' }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex mt-md">
            <Link to="/" className="text-primary font-bold">← Continue Shopping</Link>
          </div>
        </div>

        {/* Order Summary */}
        <aside>
          <div className="card" style={{ position: 'sticky', top: '100px', padding: 'var(--space-lg)' }}>
            <h3 className="mb-lg">Order Summary</h3>

            <div className="flex flex-col gap-md">
              <div className="flex flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span className="font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping</span>
                <span className="font-bold" style={{ color: shipping === 0 ? 'var(--success)' : '' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (18%)</span>
                <span className="font-bold">₹{tax.toLocaleString()}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', margin: '0.5rem 0', paddingTop: '1rem' }} className="flex flex-between">
                <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>Order Total</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-xl flex flex-col gap-md">
              <div className="flex gap-sm">
                <input type="text" placeholder="Promo Code" style={{ padding: '0.6rem' }} />
                <button className="btn btn-outline btn-sm">Apply</button>
              </div>
              <Link to="/checkout" className="btn btn-primary btn-block btn-lg">
                Proceed to Checkout
              </Link>
              <div className="flex flex-center gap-sm mt-sm" style={{ opacity: 0.6, fontSize: '0.75rem' }}>
                🔒 Secure Checkout Powered by Emporium
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
