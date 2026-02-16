import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 500;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="container" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-xl)' }}>
      <h1 className="mb-xl text-center">Checkout <span className="text-gradient">Experience</span></h1>

      <div className="grid" style={{ gridTemplateColumns: '1fr 400px', gap: 'var(--space-xl)' }}>
        <main className="animate-fade">
          <div className="flex gap-lg mb-xl justify-center">
            <div className={`flex items-center gap-xs ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: step >= 1 ? 'var(--primary)' : 'var(--border)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
              <span className="font-bold">Shipping</span>
            </div>
            <div style={{ width: '50px', height: '1px', background: 'var(--border)', alignSelf: 'center' }}></div>
            <div className={`flex items-center gap-xs ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: step >= 2 ? 'var(--primary)' : 'var(--border)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
              <span className="font-bold">Payment</span>
            </div>
            <div style={{ width: '50px', height: '1px', background: 'var(--border)', alignSelf: 'center' }}></div>
            <div className={`flex items-center gap-xs ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: step >= 3 ? 'var(--primary)' : 'var(--border)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>3</span>
              <span className="font-bold">Review</span>
            </div>
          </div>

          <div className="card">
            <h3>Shipping <span className="text-gradient">Information</span></h3>
            <form className="grid grid-2 gap-md mt-lg">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" className="input" style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Street Address</label>
                <input type="text" placeholder="123 Luxury Lane" className="input" style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" placeholder="Mumbai" className="input" style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
              </div>
              <div className="form-group">
                <label>PIN Code</label>
                <input type="text" placeholder="400001" className="input" style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
              </div>
            </form>
            <button className="btn btn-primary btn-block mt-xl" onClick={() => navigate('/orders')}>Next Step: Payment Preferences</button>
          </div>
        </main>

        <aside className="animate-fade" style={{ animationDelay: '0.1s' }}>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h4 className="mb-lg">Bag <span className="text-gradient">Summary</span></h4>
            <div className="flex flex-col gap-md mb-lg">
              {cartItems.map(item => (
                <div key={item._id} className="flex gap-md">
                  <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} · ₹{item.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }} className="flex flex-col gap-sm">
              <div className="flex flex-between">
                <span className="text-muted">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex flex-between">
                <span className="text-muted">Elite Shipping</span>
                <span className="text-success">{shipping === 0 ? 'Complimentary' : `₹${shipping}`}</span>
              </div>
              <div className="flex flex-between">
                <span className="text-muted">Taxes (GST)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex flex-between mt-sm pt-sm" style={{ borderTop: '2px solid var(--bg-main)' }}>
                <span className="font-bold text-lg">Order Total</span>
                <span className="font-bold text-lg text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
