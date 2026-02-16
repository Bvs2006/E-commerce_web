# 🛍️ EMPORIUM - QUICK START GUIDE

## What You've Got

A **complete, production-ready** multi-vendor e-commerce platform with:

✅ **Full Backend** (Node.js + Express + MongoDB)
- Authentication system with JWT
- Role-based access (User, Seller, Admin)
- Complete REST API
- Real-time chat with Socket.io
- All CRUD operations
- Order management
- Payment structure ready

✅ **Full Frontend** (React + Vite)
- Authentication pages
- Route protection
- State management (Context API)
- Responsive design
- Clean, professional UI

✅ **Database Models** (MongoDB + Mongoose)
- User, Product, Order, Chat, Coupon, Withdrawal

✅ **Production Ready**
- Error handling
- Input validation
- Security best practices
- Proper project structure

---

## 🚀 How to Run (3 Steps)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment

Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emporium
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 3: Start Everything

**Terminal 1 - Start MongoDB:**
```bash
mongod
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm run dev
```

**Done!** Open http://localhost:5173

---

## 📁 What's Included

```
emporium/
├── backend/                 # Complete Node.js backend
│   ├── models/             # 6 MongoDB models
│   ├── controllers/        # 7 controllers with all logic
│   ├── routes/             # 8 route files
│   ├── middleware/         # Auth + Error handling
│   ├── socket/             # Real-time chat handler
│   ├── config/             # Database configuration
│   └── server.js           # Main server file
│
├── frontend/               # Complete React frontend
│   ├── src/
│   │   ├── context/       # Auth + Cart state management
│   │   ├── pages/         # All page components
│   │   │   ├── auth/      # Login, Signup
│   │   │   ├── user/      # User pages
│   │   │   ├── seller/    # Seller pages
│   │   │   ├── admin/     # Admin pages
│   │   │   └── chat/      # Chat page
│   │   ├── components/    # Reusable components
│   │   ├── styles/        # Global CSS
│   │   ├── App.jsx        # Main app with routing
│   │   └── main.jsx       # Entry point
│   └── vite.config.js     # Vite configuration
│
├── README.md              # Comprehensive documentation
├── DEVELOPMENT.md         # Development guide
└── setup.sh               # Quick setup script
```

---

## 🎯 Key Features

### For Users:
- Browse and search products
- Add to cart and wishlist
- Place orders
- Track order status
- Chat with sellers
- Review products
- Multiple addresses
- Apply coupons

### For Sellers:
- Apply to become a seller
- Manage products (Add/Edit/Delete)
- View and manage orders
- Create discount coupons
- Chat with customers
- View earnings and analytics
- Update shop settings

### For Admins:
- Approve/reject seller applications
- Manage all users
- View all products and orders
- Platform analytics
- Commission tracking
- Manage withdrawals

---

## 🔐 Default Test Accounts

### Create Admin Account (Use MongoDB Compass or CLI):
```javascript
{
  name: "Admin",
  email: "admin@emporium.com",
  password: "admin123",  // Will be hashed automatically
  roles: ["admin"]
}
```

### Regular User:
Sign up through the frontend at http://localhost:5173/signup

---

## 📊 API Testing

### With Postman/Thunder Client:

**Login:**
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "test@example.com",
  "password": "password123"
}
```

**Get Products:**
```
GET http://localhost:5000/api/products
```

**Create Product (Seller only):**
```
POST http://localhost:5000/api/products
Headers: Authorization: Bearer <token>
Body: {
  "name": "Product Name",
  "description": "Description",
  "price": 999,
  "category": "Electronics",
  "stock": 10,
  "images": [{ "url": "image-url" }]
}
```

---

## 🎨 Customization

### Colors (in `frontend/src/styles/global.css`):
```css
:root {
  --primary-color: #088178;    /* Change main color */
  --add-to-cart: #ffd814;      /* Change cart button */
  --buy-now: #ffa41c;          /* Change buy button */
}
```

### Logo and Branding:
- Update site title in `frontend/index.html`
- Add your logo to `frontend/public/`
- Update colors in CSS variables

---

## 🚢 Deployment Options

### Backend:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo
- **DigitalOcean**: Use app platform

### Frontend:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist` folder
- **GitHub Pages**: Deploy static build

### Database:
- **MongoDB Atlas**: Free tier available
- Update `MONGODB_URI` in `.env`

---

## 🔧 Common Commands

### Backend:
```bash
npm run dev        # Start development server
npm start          # Start production server
```

### Frontend:
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 📚 Documentation

- **README.md** - Overview and setup instructions
- **DEVELOPMENT.md** - Detailed development guide
- **Code Comments** - Inline documentation in all files

---

## ✅ What's Production-Ready

✔️ JWT Authentication
✔️ Password Hashing (bcrypt)
✔️ Role-Based Access Control
✔️ Input Validation
✔️ Error Handling
✔️ CORS Configuration
✔️ MongoDB Indexing
✔️ Responsive Design
✔️ Clean Code Structure
✔️ API Documentation

---

## 🎯 Next Steps

1. **Run the application** - Follow the 3-step setup above
2. **Test features** - Create accounts, add products, place orders
3. **Customize** - Change colors, add your branding
4. **Add features** - Email notifications, payment integration, etc.
5. **Deploy** - Push to production when ready

---

## 🆘 Need Help?

1. Check **README.md** for detailed information
2. Check **DEVELOPMENT.md** for technical details
3. All API endpoints are documented
4. Code is commented throughout

---

## 🎉 You're Ready!

This is a **complete, working e-commerce platform**. Everything is set up and ready to use. Just install dependencies, configure MongoDB, and start coding!

**Happy Building! 🚀**
