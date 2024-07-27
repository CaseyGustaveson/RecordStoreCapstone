import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

// Route handler for getting all products
const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Route handler for getting a product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};



// Route handler for creating a new product
const createProduct = async (req, res) => {
    const { name, releaseYear, price, quantity, categoryId, imageUrl } = req.body;

    // Log the incoming request body
    console.log("Request body:", req.body);

    try {
        if (!categoryId) {
            throw new Error("Category ID is required");
        }

        // Handle price parsing
        const parsedPrice = parseFloat(price.replace('$', ''));
        if (isNaN(parsedPrice)) {
            throw new Error("Valid price is required");
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                releaseYear,
                price: parsedPrice, // Use parsed price
                quantity: parseInt(quantity, 10), // Ensure quantity is parsed as integer
                imageUrl,
                category: {
                    connect: {
                        id: parseInt(categoryId, 10), // Ensure categoryId is parsed as integer
                    },
                },
            },
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: "Error creating product", details: error.message });
    }
};



// Route handler for updating a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, releaseYear, price, quantity, categoryId, imageUrl } = req.body;

    try {
        // Ensure product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Convert price and quantity to their appropriate types
        const updatedData = {
            name: name ?? existingProduct.name,
            releaseYear: releaseYear ?? existingProduct.releaseYear,
            price: price !== undefined ? parseFloat(price.replace(/[^0-9.]/g, '')) : existingProduct.price,
            quantity: quantity !== undefined ? parseInt(quantity, 10) : existingProduct.quantity,
            imageUrl: imageUrl ?? existingProduct.imageUrl,
            category: categoryId ? { connect: { id: parseInt(categoryId) } } : undefined
        };

        // Check for valid data
        if (isNaN(updatedData.price) || updatedData.price <= 0) {
            return res.status(400).json({ error: 'Invalid price' });
        }
        if (isNaN(updatedData.quantity) || updatedData.quantity < 0) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: updatedData
        });
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// Route handler for searching products
const searchProducts = async (req, res) => {
    const { q } = req.query;
    try {
        if (!q) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: q,
                    mode: 'insensitive',
                },
            },
        });
        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Error searching products' });
    }
};

// Route handler for deleting a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // Check if the product exists before trying to delete
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete dependent cart items
        await prisma.cartItem.deleteMany({
            where: { productId: Number(id) }
        });

        // Proceed to delete the product
        await prisma.product.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: `Failed to delete product: ${error.message}` });
    }
};

// Define routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/search', searchProducts);

export default router;
