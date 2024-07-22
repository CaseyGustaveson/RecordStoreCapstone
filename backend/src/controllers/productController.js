// backend/src/controllers/productController.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const createProduct = async (req, res) => {
    const { name, price, description, quantity, categoryId, imageUrl } = req.body;
    try {
        const newProduct = await prisma.product.create({
            data: { name, price, description, quantity, categoryId, imageUrl }
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, quantity, categoryId, imageUrl } = req.body;
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: { name, price, description, quantity, categoryId, imageUrl }
        });
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const searchProducts = async (req, res) => {
    const { search } = req.query;
    try {
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        });
        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).send('Internal Server Error');
    }
};
