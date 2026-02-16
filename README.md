# 🛍️ EMPORIUM - Multi-Vendor E-Commerce Platform

A complete, production-ready multi-vendor e-commerce platform built with MERN stack (MongoDB, Express.js, React.js, Node.js) featuring real-time chat, role-based authentication, and comprehensive seller/admin management.

## 📋 Features

### 🔐 Authentication System
- JWT-based authentication
- Role-based access control (User, Seller, Admin)
- Secure password hashing with bcrypt
- Protected routes for different user types

### 👤 User Features
- Browse and search products
- Category filtering
- Product details with image zoom
- Shopping cart management
- Wishlist functionality
- Multiple address management
- Order tracking
- Real-time chat with sellers
- Product reviews and ratings
- Coupon application

### 🏪 Seller Features
- Apply to become a seller
- Seller dashboard with analytics
- Product management (CRUD operations)
- Order management with status updates
- Coupon creation and management
- Real-time chat with customers
- Earnings tracking
- Shop settings management

### 👨‍💼 Admin Features
- Platform overview dashboard
- User management
- Seller approval system
- Product moderation
- Order monitoring
- Platform analytics
- Withdrawal request management
- Commission tracking

### 💬 Real-Time Chat
- Socket.io powered messaging
- Online/offline status
- Typing indicators
- Message timestamps
- Seen status
- Product-specific chats

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Socket.io** - Real-time communication
- **Cloudinary** - Image storage (optional)
- **Stripe** - Payment integration (structure included)

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Context API** - State management
- **Socket.io-client** - Real-time updates
- **Axios** - HTTP client
- **Pure CSS** - Responsive styling

## 📂 Project Structure

```
emporium/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── sellerController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   ├── models/
│   │   ├── Chat.js
│   │   ├── Coupon.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Withdrawal.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── sellerRoutes.js
│   │   └── userRoutes.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   ├── auth/
    │   │   ├── chat/
    │   │   ├── common/
    │   │   ├── seller/
    │   │   └── user/
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   ├── auth/
    │   │   ├── chat/
    │   │   ├── seller/
    │   │   └── user/
    │   ├── styles/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd emporium/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file with your configuration:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/emporium
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   STRIPE_SECRET_KEY=your_stripe_secret_key
   
   NODE_ENV=development
   ```

5. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd emporium/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 🗄️ Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  roles: [String], // ['user'], ['user', 'seller'], or ['admin']
  sellerStatus: String, // 'none', 'pending', 'approved', 'rejected'
  shopName: String,
  shopPhone: String,
  shopAddress: String,
  shopGST: String,
  shopDescription: String,
  addresses: [AddressSchema],
  wishlist: [ProductId],
  earnings: Number
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  category: String,
  images: [{ url, public_id }],
  stock: Number,
  seller: UserId (ref),
  reviews: [ReviewSchema],
  rating: Number,
  numReviews: Number,
  soldCount: Number
}
```

### Order Schema
```javascript
{
  user: UserId (ref),
  orderItems: [OrderItemSchema],
  shippingAddress: AddressSchema,
  paymentMethod: String,
  paymentInfo: Object,
  itemsPrice: Number,
  shippingPrice: Number,
  discount: Number,
  totalPrice: Number,
  orderStatus: String, // 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  adminCommission: Number
}
```

## 🔑 API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile

### Products
- GET `/api/products` - Get all products (with filters)
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product (Seller)
- PUT `/api/products/:id` - Update product (Seller)
- DELETE `/api/products/:id` - Delete product (Seller)
- POST `/api/products/:id/review` - Add review (User)

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders/my-orders` - Get user orders
- GET `/api/orders/:id` - Get order by ID
- GET `/api/orders/seller/my-orders` - Get seller orders
- PUT `/api/orders/:id/status` - Update order status (Seller)

### Seller
- POST `/api/seller/apply` - Apply to become seller
- GET `/api/seller/dashboard` - Get seller dashboard
- PUT `/api/seller/shop-settings` - Update shop settings
- GET `/api/seller/admin/pending` - Get pending sellers (Admin)
- PUT `/api/seller/admin/:id/status` - Approve/Reject seller (Admin)

### Chat
- POST `/api/chats` - Create or get chat
- GET `/api/chats` - Get user chats
- GET `/api/chats/:id` - Get chat by ID
- POST `/api/chats/:id/message` - Send message
- DELETE `/api/chats/:id` - Delete chat

### Admin
- GET `/api/admin/dashboard` - Get admin dashboard
- GET `/api/admin/analytics` - Get platform analytics
- GET `/api/admin/withdrawals` - Get withdrawal requests
- PUT `/api/admin/withdrawals/:id` - Update withdrawal status

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- Protected API routes
- Secure HTTP headers
- CORS configuration

## 🎨 Design System

### Colors
- Primary: `#088178`
- Add to Cart: `#ffd814`
- Buy Now: `#ffa41c`
- Danger: `#e74c3c`
- Background: `#f3f3f3`

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 📝 Default Admin Account

Create an admin user manually in MongoDB or via API:
```javascript
{
  name: "Admin",
  email: "admin@emporium.com",
  password: "admin123", // Will be hashed
  roles: ["admin"]
}
```

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Ensure MongoDB connection string is set
3. Deploy using Git or CLI

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables if needed

## 📊 Key Features Implementation

### Real-Time Chat
- Socket.io connection on user login
- Room-based messaging
- Online status tracking
- Typing indicators
- Message notifications

### Payment Integration
- Stripe structure is included
- Implement with your Stripe keys
- Add payment success webhooks

### Image Upload
- Cloudinary integration structure
- Configure with your Cloudinary credentials
- Multiple image support for products

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues and questions, please open an issue in the repository.

## 🎯 Roadmap

- [ ] Email verification
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multiple language support
- [ ] Advanced search filters
- [ ] Product recommendations
- [ ] Social media integration

---

**Built with ❤️ for the e-commerce community**
