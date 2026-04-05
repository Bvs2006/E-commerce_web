import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const normalizeUser = (userData) => {
    if (!userData) {
      return userData;
    }

    return {
      ...userData,
      _id: userData._id || userData.id
    };
  };

  const setSession = (authToken, userData) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(normalizeUser(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(normalizeUser(response.data.user));
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      setSession(token, user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/signup', { name, email, password });
      const { token, user } = response.data;
      setSession(token, user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (updatedUser) => {
    setUser(normalizeUser(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    setSession,
    logout,
    updateUser,
    isAuthenticated: !!token,
    isAdmin: user?.roles?.includes('admin'),
    isSeller: user?.roles?.includes('seller') && user?.sellerStatus === 'approved',
    isSellerPending: user?.sellerStatus === 'pending'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
