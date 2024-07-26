import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

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
    const { name, description, price, quantity, categoryId, imageUrl } = req.body;
    try {
        // Ensure required fields are provided
        if (!name || !price || !quantity || !categoryId) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        const newProduct = await prisma.product.create({
            data: { 
                name, 
                description, 
                price: parseFloat(price), 
                quantity: parseInt(quantity),
                categoryId: Number(categoryId),
                imageUrl
            }
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

// Route handler for updating a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity, categoryId, imageUrl } = req.body;
    try {
        // Ensure product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: { 
                name: name ?? existingProduct.name, 
                description: description ?? existingProduct.description, 
                price: price ?? existingProduct.price, 
                quantity: quantity ?? existingProduct.quantity, 
                categoryId: categoryId ?? existingProduct.categoryId,
                imageUrl: imageUrl ?? existingProduct.imageUrl
            }
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
