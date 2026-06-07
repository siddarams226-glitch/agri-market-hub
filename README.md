# Agri Market Hub

> **Connecting Farmers Directly to Buyers** 🌾

A modern, production-ready agricultural marketplace platform that directly connects farmers with buyers, eliminating middlemen and enabling transparent, fair-priced agricultural transactions.

## 🌟 Features

### For Farmers
- ✅ Add, edit, and delete agricultural products
- ✅ Manage product inventory and pricing
- ✅ View orders received from buyers
- ✅ Track sales and revenue
- ✅ Respond to buyer inquiries

### For Buyers
- ✅ Browse fresh agricultural products
- ✅ Search and filter by category
- ✅ Add items to cart
- ✅ Place orders with secure checkout
- ✅ Track order history
- ✅ Direct contact with farmers

### Core Features
- ✅ User authentication with JWT
- ✅ Role-based access control (Farmer/Buyer)
- ✅ Secure password hashing with bcrypt
- ✅ Real-time product availability
- ✅ Cart management
- ✅ Order tracking system
- ✅ Responsive design for mobile & desktop
- ✅ Production-ready deployment

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Railway** - Database hosting

## 📁 Project Structure

```
agri-market-hub/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, validation
│   │   ├── routes/          # API routes
│   │   ├── config/          # Database config
│   │   ├── utils/           # JWT utilities
│   │   └── app.js           # Express app
│   ├── database/
│   │   └── schema.sql       # Database schema
│   ├── package.json
│   ├── server.js            # Server entry point
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Context API stores
│   │   ├── utils/           # Helper functions
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static files
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── INSTALLATION.md
│   └── DEPLOYMENT.md
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- MySQL 8.0 or higher

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Frontend** will be available at `http://localhost:5173`
**Backend** API will be available at `http://localhost:5000/api`

For detailed setup instructions, see [INSTALLATION.md](docs/INSTALLATION.md)

## 📖 Documentation

- **[Installation Guide](docs/INSTALLATION.md)** - Setup instructions for development
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy to production

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Secure password hashing using bcrypt
- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- CORS protection
- Role-based access control (RBAC)
- Protected routes on frontend and backend

## 📊 Database Schema

### Core Tables
- **users** - User accounts (farmers & buyers)
- **products** - Agricultural products
- **cart** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Items in each order

See [schema.sql](backend/database/schema.sql) for complete schema

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Farmer)
- `PUT /api/products/:id` - Update product (Farmer)
- `DELETE /api/products/:id` - Delete product (Farmer)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/:cartId` - Update quantity
- `DELETE /api/cart/:cartId` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId/cancel` - Cancel order

See [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for complete API reference

## 📸 Screenshots

### Home Page
- Featured products section
- Key features overview
- Call-to-action buttons

### Product Listing
- Grid view of products
- Search and filter capabilities
- Product details card

### Farmer Dashboard
- Add/Edit/Delete products
- Manage inventory
- View received orders

### Buyer Experience
- Browse and search products
- Add to cart
- Secure checkout
- Order tracking

## 🚢 Deployment

Production deployment is simplified with cloud services:

### Frontend (Vercel)
```bash
npm run build
# Push to GitHub → Auto-deploy on Vercel
```

### Backend (Render)
```bash
# Push to GitHub → Auto-deploy on Render
```

### Database (Railway)
- MySQL database provisioned on Railway
- Automatic backups
- Scalable resources

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step deployment guide

## 📋 Testing Accounts

After setup, sample accounts are available:

**Farmer:**
- Email: `rajesh@farmer.com`
- Role: Farmer

**Buyer:**
- Email: `amit@buyer.com`
- Role: Buyer

See [INSTALLATION.md](docs/INSTALLATION.md) for login instructions

## 🐛 Known Issues & Limitations

- Current implementation uses sample image URLs (integrate with image upload service for production)
- No payment integration (can be added with Razorpay or Stripe)
- No email notifications (can be added with SendGrid or Nodemailer)
- No SMS notifications
- Rating and review system not implemented

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Razorpay, Stripe)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Product ratings and reviews
- [ ] Advanced search with filters
- [ ] Real-time chat between farmers and buyers
- [ ] Video product demonstrations
- [ ] Farmer verification system
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## 💪 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details

## 🤝 Support

For issues, questions, or suggestions:

1. Check [API Documentation](docs/API_DOCUMENTATION.md)
2. Review [Installation Guide](docs/INSTALLATION.md)
3. See [Deployment Guide](docs/DEPLOYMENT.md)
4. Open an issue on GitHub

## 👥 Team

- **Developer** - Full-stack development
- **Contributors** - Open for collaboration

## 🙏 Acknowledgments

- React community for excellent tools
- Express.js for powerful backend framework
- Tailwind CSS for beautiful styling
- All open-source contributors

## 📞 Contact

- Email: [your-email@example.com]
- GitHub: [@your-username]
- LinkedIn: [your-profile]

---

<div align="center">

### Made with ❤️ by Agri Market Hub Team

**Connecting Farmers Directly to Buyers** 🌾

[⬆ Back to top](#agri-market-hub)

</div>
