# EMPORIUM - Development Guide

## Project Overview

Emporium is a complete multi-vendor e-commerce platform built with the MERN stack. This document provides comprehensive information for developers working on this project.

## Architecture

### Backend Architecture
- **Framework**: Express.js with Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io for chat functionality
- **API Design**: RESTful API architecture

### Frontend Architecture
- **UI Library**: React.js 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **State Management**: Context API
- **Styling**: Pure CSS with CSS Variables
- **HTTP Client**: Axios

## Database Schemas

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed with bcrypt),
  roles: Array<String>, // ['user', 'seller', 'admin']
  sellerStatus: String, // 'none', 'pending', 'approved', 'rejected'
  shopName: String,
  shopPhone: String,
  shopAddress: String,
  shopGST: String,
  shopDescription: String,
  addresses: Array<Address>,
  wishlist: Array<ProductId>,
  earnings: Number,
  createdAt: Date
}
```

### Product Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  category: String,
  images: Array<{ url: String, public_id: String }>,
  stock: Number,
  seller: ObjectId (ref: User),
  reviews: Array<Review>,
  rating: Number,
  numReviews: Number,
  soldCount: Number,
  createdAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  orderItems: Array<OrderItem>,
  shippingAddress: Address,
  paymentMethod: String,
  paymentInfo: Object,
  itemsPrice: Number,
  shippingPrice: Number,
  discount: Number,
  totalPrice: Number,
  orderStatus: String,
  adminCommission: Number,
  deliveredAt: Date,
  createdAt: Date
}
```

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |

### Product Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get product by ID | Public |
| POST | `/api/products` | Create product | Seller |
| PUT | `/api/products/:id` | Update product | Seller |
| DELETE | `/api/products/:id` | Delete product | Seller |
| GET | `/api/products/seller/my-products` | Get seller's products | Seller |
| POST | `/api/products/:id/review` | Add review | User |

### Order Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Create order | User |
| GET | `/api/orders/my-orders` | Get user orders | User |
| GET | `/api/orders/:id` | Get order by ID | User/Seller |
| GET | `/api/orders/seller/my-orders` | Get seller orders | Seller |
| PUT | `/api/orders/:id/status` | Update order status | Seller |
| GET | `/api/orders/admin/all` | Get all orders | Admin |

### Seller Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/seller/apply` | Apply to become seller | User |
| GET | `/api/seller/dashboard` | Get seller dashboard | Seller |
| PUT | `/api/seller/shop-settings` | Update shop settings | Seller |
| GET | `/api/seller/admin/pending` | Get pending sellers | Admin |
| PUT | `/api/seller/admin/:id/status` | Approve/Reject seller | Admin |

### Chat Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/chats` | Create or get chat | User |
| GET | `/api/chats` | Get user chats | User |
| GET | `/api/chats/:id` | Get chat by ID | User |
| POST | `/api/chats/:id/message` | Send message | User |

## Socket.io Events

### Client to Server
- `join` - User joins with their ID
- `joinChat` - Join specific chat room
- `sendMessage` - Send a message
- `typing` - User is typing
- `stopTyping` - User stopped typing
- `markAsSeen` - Mark messages as seen

### Server to Client
- `userOnline` - User came online
- `userOffline` - User went offline
- `newMessage` - New message received
- `notification` - General notification
- `userTyping` - Other user is typing
- `userStopTyping` - Other user stopped typing
- `messagesSeen` - Messages marked as seen

## Authentication Flow

1. **Signup**:
   - User submits name, email, password
   - Password is hashed with bcrypt
   - User is created with 'user' role
   - JWT token is generated and returned

2. **Login**:
   - User submits email and password
   - Password is compared with hashed password
   - JWT token is generated and returned

3. **Protected Routes**:
   - Client sends JWT in Authorization header
   - Server verifies JWT and attaches user to request
   - Route handler checks user role if needed

## Frontend State Management

### AuthContext
- Manages user authentication state
- Provides login, signup, logout functions
- Stores JWT token in localStorage
- Sets axios default headers

### CartContext
- Manages shopping cart state
- Stores cart in localStorage
- Provides add, remove, update functions
- Calculates cart totals

## Styling Guidelines

### CSS Variables
All colors, spacing, and design tokens are defined as CSS variables in `global.css`:
- Colors: `--primary-color`, `--danger`, etc.
- Spacing: `--spacing-sm`, `--spacing-md`, etc.
- Radius: `--radius-sm`, `--radius-md`, etc.

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Component Structure
```
components/
  ├── common/      # Reusable components (Button, Card, Modal)
  ├── auth/        # Authentication components
  ├── user/        # User-specific components
  ├── seller/      # Seller-specific components
  └── admin/       # Admin-specific components
```

## Development Workflow

### Starting Development

1. **Start MongoDB**:
   ```bash
   mongod
   ```

2. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

### Making API Calls

All API calls should use axios with the base URL configured in vite proxy:

```javascript
// The proxy is configured in vite.config.js
import axios from 'axios';

// This will proxy to http://localhost:5000/api/products
const response = await axios.get('/api/products');
```

### Adding New Features

1. **Backend**:
   - Create model in `models/`
   - Create controller in `controllers/`
   - Create routes in `routes/`
   - Register routes in `server.js`

2. **Frontend**:
   - Create page component in `pages/`
   - Add route in `App.jsx`
   - Create reusable components in `components/`

## Security Considerations

1. **Password Security**:
   - Passwords are hashed with bcrypt (10 rounds)
   - Never store plain text passwords

2. **JWT Security**:
   - Tokens expire after 7 days
   - Use strong secret key in production
   - Store tokens securely (httpOnly cookies in production)

3. **Input Validation**:
   - Validate all user inputs
   - Use express-validator for server-side validation
   - Sanitize inputs to prevent XSS

4. **CORS**:
   - Configure CORS properly in production
   - Whitelist specific origins

5. **Rate Limiting**:
   - Implement rate limiting for API endpoints
   - Prevent brute force attacks

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_strong_secret
   ```

2. Deploy:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel/Netlify)

1. Build:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emporium
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_key
NODE_ENV=development
```

## Common Issues and Solutions

### Issue: MongoDB Connection Error
**Solution**: Ensure MongoDB is running with `mongod` command

### Issue: CORS Error
**Solution**: Check CORS configuration in `server.js` and ensure frontend URL is allowed

### Issue: JWT Token Invalid
**Solution**: Check if token is being sent in Authorization header and JWT_SECRET matches

### Issue: Port Already in Use
**Solution**: Kill the process using the port or change PORT in .env

## Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Use functional components with hooks
- Use async/await for async operations
- Use meaningful variable names
- Add comments for complex logic

### CSS
- Use CSS variables for colors and spacing
- Follow BEM naming convention for classes
- Keep specificity low
- Make components responsive

## Performance Optimization

1. **Backend**:
   - Index frequently queried fields
   - Use pagination for large datasets
   - Cache frequently accessed data
   - Optimize database queries

2. **Frontend**:
   - Lazy load routes
   - Optimize images
   - Use React.memo for expensive components
   - Implement virtual scrolling for large lists

## Future Enhancements

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced search with Elasticsearch
- [ ] Product recommendations
- [ ] Social login (Google, Facebook)
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)
- [ ] Advanced analytics dashboard
- [ ] Automated testing suite

## Support and Documentation

For issues and questions:
1. Check this documentation
2. Check README.md
3. Open an issue on GitHub
4. Contact the development team

## License

MIT License - See LICENSE file for details
