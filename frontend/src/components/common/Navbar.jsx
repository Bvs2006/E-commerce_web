import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin, isSeller } = useAuth();
    const { getCartCount } = useCart();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <nav style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container flex flex-between">
                <Link to="/" className="flex items-center gap-sm" style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--primary)'
                }}>
                    <div style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '0.1rem 0.5rem',
                        borderRadius: '4px'
                    }}>E</div>
                    <span>Emporium</span>
                </Link>

                <form onSubmit={handleSearch} className="search-bar flex" style={{ flex: 0.4 }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: '0.4rem 1rem',
                            width: '100%',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)'
                        }}
                    />
                </form>

                <div className="nav-links flex gap-md items-center">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/cart" className="nav-link">
                        Cart ({getCartCount()})
                    </Link>
                    <Link to="/wishlist" className="nav-link">
                        Wishlist ({wishlist.length})
                    </Link>

                    {isAuthenticated ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                            >
                                {user?.name} ▾
                            </button>
                            {showProfileMenu && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    width: '180px',
                                    backgroundColor: 'white',
                                    border: '1px solid var(--border)',
                                    padding: '0.5rem',
                                    boxShadow: 'var(--shadow-md)',
                                    zIndex: 100
                                }}>
                                    <Link to="/dashboard" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>My Dashboard</Link>
                                    {isSeller && <Link to="/seller/dashboard" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>Seller Hub</Link>}
                                    {isAdmin && <Link to="/admin/dashboard" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>Admin Panel</Link>}
                                    <Link to="/wishlist" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>Wishlist</Link>
                                    <Link to="/orders" className="dropdown-link" onClick={() => setShowProfileMenu(false)}>My Orders</Link>
                                    <hr style={{ margin: '0.5rem 0', border: '0', borderTop: '1px solid #eee' }} />
                                    <button onClick={handleLogout} className="dropdown-link" style={{ color: 'var(--danger)', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-sm">
                            <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>Login</Link>
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .nav-link {
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .nav-link:hover { color: var(--primary); }
                .dropdown-link {
                    display: block;
                    padding: 0.5rem;
                    font-size: 0.85rem;
                    border-radius: 4px;
                }
                .dropdown-link:hover { background: #f8fafc; color: var(--primary); }
            `}</style>
        </nav>
    );
};

export default Navbar;
