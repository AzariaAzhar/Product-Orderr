const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging line

        const { name, price, stock, description } = req.body;
        if (!name || !price || !description) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        const product = new Product({ name, price, stock: stock || 0, description });

        const newProduct = await product.save();
        console.log("Saved Product:", newProduct); // Debugging line

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error Saving Product:", error); // Debugging line
        res.status(400).json({ message: error.message });
    }
};



exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        Object.assign(product, req.body);
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
