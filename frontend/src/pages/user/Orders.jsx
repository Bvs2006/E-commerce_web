import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': { bg: 'rgba(251, 191, 36, 0.1)', text: '#f59e0b' },
      'Processing': { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
      'Shipped': { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6' },
      'Delivered': { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
      'Cancelled': { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' }
    };
    return colors[status] || colors['Pending'];
  };

  if (loading) {
    return (
      <div className="flex flex-center" style={{ minHeight: '400px' }}>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="flex flex-between items-center mb-lg">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Orders</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {orders.length > 0 ? `You have ${orders.length} order${orders.length > 1 ? 's' : ''} ` : 'No orders yet'}
          </p>
        </div>
        <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
      </div>

      <div className="flex flex-col gap-md">
        {orders.length > 0 ? orders.map((order) => (
          <div key={order._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="flex flex-between" style={{
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid var(--border)',
              padding: '1rem 1.5rem'
            }}>
              <div className="flex gap-xl">
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</div>
                  <div className="font-bold" style={{ fontSize: '0.95rem' }}>#{order._id.slice(-8)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</div>
                  <div className="font-bold" style={{ fontSize: '0.95rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
                  <div className="font-bold" style={{ fontSize: '0.95rem' }}>₹{order.totalPrice?.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-md">
                <span className="badge" style={{
                  backgroundColor: getStatusColor(order.orderStatus).bg,
                  color: getStatusColor(order.orderStatus).text,
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.85rem'
                }}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div className="flex flex-col gap-md">
                {order.orderItems?.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex flex-between items-center">
                    <div className="flex gap-md items-center">
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: '1px solid var(--border)',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>{item.name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="font-bold">₹{(item.price * item.quantity)?.toLocaleString()}</div>
                  </div>
                ))}
                {order.orderItems?.length > 3 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                    +{order.orderItems.length - 3} more item{order.orderItems.length - 3 > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="flex gap-md mt-lg" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <Link to={`/ orders / ${order._id} `} className="btn btn-outline" style={{ flex: 1 }}>
                  View Details
                </Link>
                {order.orderStatus === 'Delivered' && (
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                    Buy Again
                  </button>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Orders Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Start shopping and your orders will appear here.
            </p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
