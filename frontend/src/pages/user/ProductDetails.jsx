import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/api/products/${id}`);
            setProduct(response.data.product);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-center" style={{ minHeight: '400px' }}>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2>Product not found</h2>
                    <Link to="/shop" className="btn btn-primary mt-md">Back to Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div className="grid grid-2 gap-lg">
                    {/* Product Images */}
                    <div>
                        <div style={{
                            height: '500px',
                            background: '#f8fafc',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={product.images[selectedImage]?.url || '/placeholder.png'}
                                alt={product.name}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-sm">
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: '#f8fafc',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: 'pointer',
                                            border: selectedImage === idx ? '2px solid var(--primary)' : '1px solid var(--border)',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <img src={img.url} alt={`${product.name} ${idx + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-xs">
                            <span className="badge badge-primary">{product.category}</span>
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.name}</h1>
                        <div className="flex gap-md items-center mb-md">
                            <div style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
                                {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
                            </div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                            </span>
                        </div>

                        <div className="flex items-end gap-md mb-md">
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: 0 }}>
                                ₹{product.price.toLocaleString()}
                            </h2>
                            {product.stock > 0 ? (
                                <span style={{ color: 'var(--success)', fontSize: '0.9rem', fontWeight: '500' }}>In Stock</span>
                            ) : (
                                <span style={{ color: 'var(--danger)', fontSize: '0.9rem', fontWeight: '500' }}>Out of Stock</span>
                            )}
                        </div>

                        <p style={{ lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            {product.description}
                        </p>

                        <div className="flex gap-md items-center mb-xl">
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{ padding: '0.75rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                    -
                                </button>
                                <span style={{ padding: '0 1.5rem', fontSize: '1.1rem', fontWeight: '500' }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    style={{ padding: '0.75rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-md mb-xl">
                            <button
                                className="btn btn-primary btn-lg"
                                style={{ flexGrow: 1 }}
                                onClick={() => addToCart(product, quantity)}
                                disabled={product.stock === 0}
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => toggleWishlist(product._id)}
                                style={{
                                    background: isInWishlist(product._id) ? '#fee2e2' : 'white',
                                    border: `2px solid ${isInWishlist(product._id) ? '#ef4444' : 'var(--border)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    width: '52px', height: '52px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.5rem',
                                    flexShrink: 0
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {isInWishlist(product._id) ? '❤️' : '🤍'}
                            </button>
                        </div>

                        <div className="grid grid-2 gap-md pt-xl" style={{ borderTop: '1px solid var(--border)' }}>
                            <div className="flex gap-md items-center">
                                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                                <div>
                                    <p className="font-bold" style={{ fontSize: '0.9rem', margin: 0 }}>Genuine Product</p>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.75rem', margin: 0 }}>Verified Authenticity</p>
                                </div>
                            </div>
                            <div className="flex gap-md items-center">
                                <span style={{ fontSize: '1.5rem' }}>↩️</span>
                                <div>
                                    <p className="font-bold" style={{ fontSize: '0.9rem', margin: 0 }}>Easy Return Policy</p>
                                    <p style={{ color: 'var(--text-light)', fontSize: '0.75rem', margin: 0 }}>30 Days Easy Return</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-xl card" style={{ background: 'var(--bg-main)', border: 'none' }}>
                            <div className="flex items-center gap-md">
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%', background: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                                }}>🏬</div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Sold by</p>
                                    <h4 style={{ fontSize: '1rem', margin: 0 }}>{product.seller?.shopName || 'Emporium Shop'}</h4>
                                </div>
                                <Link to={`/shop/${product.seller?._id}`} className="text-primary font-bold" style={{ fontSize: '0.85rem', marginLeft: 'auto' }}>View Shop →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', borderTop: '1px solid var(--border)' }}>
                <div className="flex flex-between items-center mb-lg">
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Customer Reviews</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            {product.numReviews > 0 ? `${product.numReviews} review${product.numReviews > 1 ? 's' : ''}` : 'No reviews yet'}
                        </p>
                    </div>
                    {product.rating > 0 && (
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{product.rating}</div>
                            <div style={{ color: '#f59e0b', fontSize: '1.2rem' }}>
                                {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-2 gap-lg" style={{ alignItems: 'start' }}>
                    {/* Review Form */}
                    <div className="card" style={{ background: '#f8fafc', border: '1px solid var(--border)', position: 'sticky', top: '20px' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: '600' }}>Write a Review</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const rating = e.target.rating.value;
                            const comment = e.target.comment.value;

                            try {
                                const response = await axios.post(`/api/products/${id}/review`, { rating, comment });
                                if (response.data.success) {
                                    alert('✅ Review submitted successfully!');
                                    window.location.reload();
                                }
                            } catch (error) {
                                alert(error.response?.data?.message || 'Failed to submit review');
                            }
                        }}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                                    Your Rating
                                </label>
                                <select
                                    name="rating"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border)',
                                        background: 'white',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    <option value="">Select a rating</option>
                                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                                    <option value="4">⭐⭐⭐⭐ Good</option>
                                    <option value="3">⭐⭐⭐ Average</option>
                                    <option value="2">⭐⭐ Below Average</option>
                                    <option value="1">⭐ Poor</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                                    Your Review
                                </label>
                                <textarea
                                    name="comment"
                                    required
                                    rows="5"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border)',
                                        background: 'white',
                                        fontSize: '0.95rem',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Share your thoughts about this product..."
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Submit Review
                            </button>
                        </form>
                    </div>

                    {/* Reviews List */}
                    <div>
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review, index) => (
                                <div
                                    key={index}
                                    className="card"
                                    style={{
                                        marginBottom: '1rem',
                                        padding: '1.25rem',
                                        background: 'white',
                                        border: '1px solid var(--border)'
                                    }}
                                >
                                    <div className="flex flex-between items-start" style={{ marginBottom: '0.75rem' }}>
                                        <div>
                                            <div style={{ color: '#f59e0b', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <p style={{
                                        marginTop: '0.75rem',
                                        lineHeight: '1.6',
                                        color: 'var(--text-main)',
                                        fontSize: '0.95rem'
                                    }}>
                                        {review.comment}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div
                                className="card"
                                style={{
                                    textAlign: 'center',
                                    padding: '3rem 2rem',
                                    background: '#f8fafc',
                                    border: '2px dashed var(--border)'
                                }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Reviews Yet</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    Be the first to share your experience with this product!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
