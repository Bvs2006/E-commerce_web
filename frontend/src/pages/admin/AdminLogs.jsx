import { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminLogs = () => {
    const [logs] = useState([
        { id: 1, event: 'New Seller Request', details: 'Shop "Handmade Goods" submitted application', time: '10 mins ago', type: 'info', user: 'System' },
        { id: 2, event: 'Order Completed', details: '₹12,450 paid to Urban Trends', time: '25 mins ago', type: 'success', user: 'Finance' },
        { id: 3, event: 'Failed Login', details: 'Invalid password from IP 103.24.x.x', time: '1 hour ago', type: 'danger', user: 'Security' },
        { id: 4, event: 'Product Update', details: 'Updated 142 items in inventory', time: '2 hours ago', type: 'success', user: 'System' },
        { id: 5, event: 'Price Flag', details: 'Item #7021 flagged for high price', time: '3 hours ago', type: 'warning', user: 'Admin' },
    ]);

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div className="flex flex-between items-center mb-lg">
                <div>
                    <h1 style={{ fontSize: '2rem' }}>System Logs</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Viewing recent system activity and audit logs.</p>
                </div>
                <Link to="/admin/dashboard" className="btn btn-outline">Back to Dashboard</Link>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Activity History</h3>
                    <select style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                        <option>All Events</option>
                        <option>Errors Only</option>
                        <option>Seller Activity</option>
                    </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc' }}>
                                <th style={{ padding: '1rem' }}>Time</th>
                                <th style={{ padding: '1rem' }}>Event</th>
                                <th style={{ padding: '1rem' }}>Source</th>
                                <th style={{ padding: '1rem' }}>Details</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>{log.time}</td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{log.event}</td>
                                    <td style={{ padding: '1rem' }}>{log.user}</td>
                                    <td style={{ padding: '1rem' }}>{log.details}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: log.type === 'danger' ? '#fee2e2' : log.type === 'success' ? '#dcfce7' : '#f1f5f9',
                                            color: log.type === 'danger' ? '#b91c1c' : log.type === 'success' ? '#15803d' : '#475569'
                                        }}>
                                            {log.type.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
