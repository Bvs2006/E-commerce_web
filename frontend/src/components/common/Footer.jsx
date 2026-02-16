import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#1e293b',
            color: 'white',
            padding: '3rem 0 2rem',
            marginTop: '3rem'
        }}>
            <div className="container">
                <div className="grid grid-4 gap-lg">
                    <div>
                        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Emporium</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                            A simple e-commerce project built with MERN stack.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}><Link to="/" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Home</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link to="/shop" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Shop</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link to="/cart" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Cart</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Accounts</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}><Link to="/login" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Login</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link to="/signup" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Register</Link></li>
                            <li style={{ marginBottom: '0.5rem' }}><Link to="/become-seller" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Become Seller</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>Contact</h4>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            Email: support@emporium.com<br />
                            Phone: +91 00000 00000<br />
                            Address: College Campus, India
                        </p>
                    </div>
                </div>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.8rem'
                }}>
                    <p>&copy; {new Date().getFullYear()} Emporium Project. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
