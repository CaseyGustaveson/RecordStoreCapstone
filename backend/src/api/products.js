import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();

// Route handlers

const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany(); 
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

const paginateProducts = async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        return res.status(400).json({ error: 'Invalid page or limit' });
    }

    const offset = (page - 1) * limit;

    try {
        const [products, totalProducts] = await Promise.all([
            prisma.product.findMany({
                skip: offset,
                take: limit
            }),
            prisma.product.count(),
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            products,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};


const getProductById = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }
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

const createProduct = async (req, res) => {
    const { name, releaseYear, price, quantity, categoryId, imageUrl } = req.body;

    try {
        if (!categoryId) {
            return res.status(400).json({ error: "Category ID is required" });
        }

        const categoryExists = await prisma.category.findUnique({
            where: { id: parseInt(categoryId, 10) },
        });

        if (!categoryExists) {
            return res.status(400).json({ error: "Category does not exist" });
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ error: "Valid price is required" }); 
        }
        const parsedReleaseYear = parseInt(releaseYear, 10);
        if (isNaN(parsedReleaseYear)) {
            return res.status(400).json({ error: "Valid release year is required" });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                releaseYear: parsedReleaseYear,
                price: parsedPrice,
                quantity: quantity ? parseInt(quantity, 10) : 1,
                imageUrl,
                category: {
                    connect: { id: parseInt(categoryId, 10) },
                },
            },
        });

        res.status(201).json(newProduct);

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: "Error creating product", details: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, releaseYear, price, quantity, categoryId, imageUrl } = req.body;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }
    try {
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const parsedReleaseYear = parseInt(releaseYear, 10);
        if (isNaN(parsedReleaseYear)) {
            return res.status(400).json({ error: "Valid release year is required" });
        }
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ error: "Valid price is required" }); 
        }

        const updatedData = {
            name: name ?? existingProduct.name,
            releaseYear: parsedReleaseYear ?? existingProduct.releaseYear,
            price: parsedPrice,
            quantity: quantity ?? existingProduct.quantity,
            imageUrl: imageUrl ?? existingProduct.imageUrl,
            category: categoryId ? { connect: { id: parseInt(categoryId) } } : undefined
        };

        if (isNaN(updatedData.quantity) || updatedData.quantity <= 0) {
            updatedData.quantity = 1;
        }
        if (isNaN(updatedData.price) || updatedData.price <= 0) {
            return res.status(400).json({ error: 'Invalid price' });
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

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await prisma.cartItem.deleteMany({
            where: { productId: Number(id) }
        });
        await prisma.product.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: `Failed to delete product: ${error.message}` });
    }
};

const searchProducts = async (req, res) => {
    console.log(req.query)
    const { query, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const [products, totalProducts] = await Promise.all([
            prisma.product.findMany({
                where: {
                    name: {
                        contains: query,
                        mode: 'insensitive'
                    }
                },
                skip: offset,
                take: parseInt(limit, 10)
            }),
            prisma.product.count({
                where: {
                    name: {
                        contains: query,
                        mode: 'insensitive'
                    }
                }
            })
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            products,
            totalPages,
            currentPage: parseInt(page, 10),
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: `Failed to search products: ${error.message}` });
    }
};

// Define routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/paginate', paginateProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);


export default router;
