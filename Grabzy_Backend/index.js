const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const authenticate = require('./middleware/authenticate');

const authRoutes = require('./routes/auth/user');
const restaurantRoutes = require('./routes/restaurant/restaurant');
const menuRoutes = require('./routes/menu/menu');
const cartRoutes = require('./routes/cart/cart');
const cartItemsRoutes = require('./routes/cart/cartItems');
const profileRoutes = require('./routes/profile/user_profile');
// const orderRoutes = require('./routes/orders');

// Middleware
app.use(cors());
app.use(express.json());

// Routing
app.use('/api/auth', authRoutes);
app.use('/api/restaurant',authenticate ,restaurantRoutes);
app.use('/api/menu',authenticate ,menuRoutes);
app.use('/api/cart',authenticate, cartRoutes);
app.use('/api/cart_items',authenticate ,cartItemsRoutes);
app.use('/api/profile',authenticate ,profileRoutes);
// app.use('/api/orders', orderRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
