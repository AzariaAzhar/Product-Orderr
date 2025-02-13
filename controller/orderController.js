const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('productId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('productId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const product = await Product.findById(req.body.productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        if (product.stock < req.body.quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const order = new Order({
            productId: req.body.productId,
            quantity: req.body.quantity,
            totalPrice: product.price * req.body.quantity
        });

        const newOrder = await order.save();
        
        // Update product stock
        product.stock -= req.body.quantity;
        await product.save();

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (req.body.status) {
            order.status = req.body.status;
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Return stock to product
        const product = await Product.findById(order.productId);
        if (product) {
            product.stock += order.quantity;
            await product.save();
        }

        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};