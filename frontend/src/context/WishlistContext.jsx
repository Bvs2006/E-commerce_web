import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await axios.get('/api/user/wishlist');
            if (response.data.success) {
                setWishlist(response.data.wishlist);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [user]);

    const toggleWishlist = async (productId) => {
        if (!user) {
            alert('Please login to add items to wishlist');
            return;
        }

        const isExist = wishlist.find(item => item._id === productId);

        try {
            if (isExist) {
                const response = await axios.delete(`/api/user/wishlist/${productId}`);
                if (response.data.success) {
                    setWishlist(wishlist.filter(item => item._id !== productId));
                }
            } else {
                const response = await axios.post(`/api/user/wishlist/${productId}`);
                if (response.data.success) {
                    // Fetch again to get full product details if needed or just add ID
                    fetchWishlist();
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
