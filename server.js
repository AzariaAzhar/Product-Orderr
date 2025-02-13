const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const productRoutes = require('./router/productRoutes');
const orderRoutes = require('./router/orderRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Create .env file and add your MongoDB connection string
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});