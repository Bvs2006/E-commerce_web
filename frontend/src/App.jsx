import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// User Pages
import Home from './pages/user/Home';
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Orders from './pages/user/Orders';
import Wishlist from './pages/user/Wishlist';
import UserDashboard from './pages/user/UserDashboard';
import Shop from './pages/user/Shop';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductsManagement from './pages/seller/ProductsManagement';
import SellerOrders from './pages/seller/SellerOrders';
import Coupons from './pages/seller/Coupons';
import ShopSettings from './pages/seller/ShopSettings';
import BecomeSellerForm from './pages/seller/BecomeSellerForm';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import SellersApproval from './pages/admin/SellersApproval';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminLogs from './pages/admin/AdminLogs';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Chat
import ChatPage from './pages/chat/ChatPage';

// Protected Route Components
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const SellerRoute = ({ children }) => {
  const { isSeller, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isSeller ? children : <Navigate to="/" />;
};

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAdmin ? children : <Navigate to="/" />;
};

import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Navbar />
            <main style={{ minHeight: '80vh' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/products" element={<Shop />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/product/:id" element={<ProductDetails />} />

                {/* Protected User Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/become-seller"
                  element={
                    <ProtectedRoute>
                      <BecomeSellerForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  }
                />

                {/* Seller Routes */}
                <Route
                  path="/seller/dashboard"
                  element={
                    <SellerRoute>
                      <SellerDashboard />
                    </SellerRoute>
                  }
                />
                <Route
                  path="/seller/products"
                  element={
                    <SellerRoute>
                      <ProductsManagement />
                    </SellerRoute>
                  }
                />
                <Route
                  path="/seller/orders"
                  element={
                    <SellerRoute>
                      <SellerOrders />
                    </SellerRoute>
                  }
                />
                <Route
                  path="/seller/coupons"
                  element={
                    <SellerRoute>
                      <Coupons />
                    </SellerRoute>
                  }
                />
                <Route
                  path="/seller/settings"
                  element={
                    <SellerRoute>
                      <ShopSettings />
                    </SellerRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <UsersManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/sellers"
                  element={
                    <AdminRoute>
                      <SellersApproval />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/logs"
                  element={
                    <AdminRoute>
                      <AdminLogs />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
