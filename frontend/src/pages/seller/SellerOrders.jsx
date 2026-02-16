import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders/seller/my-orders');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`/api/orders/${id}/status`, { status: newStatus });
      if (response.data.success) {
        setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="flex flex-between items-center mb-lg">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Received Orders</h1>
          <p style={{ color: 'var(--text-muted)' }}>Fulfill and manage your customers' orders.</p>
        </div>
        <Link to="/seller/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary btn-sm">Active Orders ({orders.filter(o => o.orderStatus !== 'Delivered').length})</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '1rem' }}>Order ID</th>
                <th style={{ padding: '1rem' }}>Customer</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>#{order._id.slice(-6).toUpperCase()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{order.user?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.orderItems?.length} Items</div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{order.totalPrice.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: order.orderStatus === 'Delivered' ? '#dcfce7' : order.orderStatus === 'Shipped' ? '#dbeafe' : '#fef9c3',
                      color: order.orderStatus === 'Delivered' ? '#15803d' : order.orderStatus === 'Shipped' ? '#1d4ed8' : '#854d0e'
                    }}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div className="flex gap-sm justify-end">
                      {order.orderStatus === 'Processing' && (
                        <button
                          onClick={() => updateStatus(order._id, 'Shipped')}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                        >Ship</button>
                      )}
                      {order.orderStatus === 'Shipped' && (
                        <button
                          onClick={() => updateStatus(order._id, 'Delivered')}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.75rem', borderColor: 'green', color: 'green' }}
                        >Mark Delivered</button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No orders found.
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

export default SellerOrders;
