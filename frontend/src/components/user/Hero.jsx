import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div style={{
            padding: '4rem 0',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '2rem'
        }}>
            <div className="container flex flex-between items-center">
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to Emporium</h1>
                    <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem', maxWidth: '600px' }}>
                        A simple e-commerce platform for all your shopping needs. Browse our collection and find what you're looking for.
                    </p>
                    <div className="flex gap-md">
                        <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
                        <Link to="/signup" className="btn btn-outline">Create Account</Link>
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <img
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
                        alt="Shopping"
                        style={{ width: '100%', maxWidth: '450px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;
