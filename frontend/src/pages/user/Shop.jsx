import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Shop = () => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(categoryParam || 'All');

    const categories = ['All', 'Fashion', 'Electronics', 'Home Decor', 'Art', 'Jewelry'];

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

    // Filter by category
    let filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory);

    // Filter by search query
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div className="flex flex-between items-end mb-lg">
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        {searchQuery ? 'Search Results' : 'Product Collections'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {searchQuery
                            ? `Showing results for "${searchQuery}"`
                            : 'Browse through our wide range of products.'}
                    </p>
                </div>
                <div className="flex items-center gap-md">
                    {searchQuery && (
                        <Link to="/shop" className="btn btn-outline btn-sm">
                            Clear Search
                        </Link>
                    )}
                    <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                        Items: {filteredProducts.length}
                    </div>
                </div>
            </div>

            <div className="flex gap-sm mb-lg overflow-x-auto pb-sm">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '0.4rem 1.2rem', whiteSpace: 'nowrap' }}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-center" style={{ minHeight: '400px' }}>
                    <p>Loading collection...</p>
                </div>
            ) : (
                <div className="grid grid-4 gap-md">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="card flex flex-col h-full" style={{ padding: 0 }}>
                            <div style={{ position: 'relative', height: '260px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                                <Link to={`/product/${product._id}`} style={{ display: 'block', height: '100%' }}>
                                    <img
                                        src={product.images?.[0]?.url || '/placeholder.png'}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </Link>
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
                                <div className="flex flex-between mb-xs">
                                    <span className="badge badge-primary">{product.category}</span>
                                    <div style={{ fontSize: '0.8rem' }}>⭐ {product.rating}</div>
                                </div>
                                <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', fontWeight: '600' }}>{product.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem', flexGrow: 1 }}>
                                    {product.description.substring(0, 50)}...
                                </p>
                                <div className="flex flex-between items-center mt-auto">
                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>₹{product.price.toLocaleString()}</span>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                        onClick={() => addToCart(product)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredProducts.length === 0 && (
                <div className="card text-center" style={{ padding: '3rem' }}>
                    <h3>No products found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>We couldn't find any products in this category.</p>
                    <button className="btn btn-outline mt-md" onClick={() => setActiveCategory('All')}>View All</button>
                </div>
            )}
        </div>
    );
};

export default Shop;
