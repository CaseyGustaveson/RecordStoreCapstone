import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

<<<<<<< HEAD
// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    console.error('Error getting product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, categoryId, imageUrl } = req.body;

    // Check if categoryId exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: `Category with id ${categoryId} not found` });
    }

    // Create new product with categoryId
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        categoryId,
        imageUrl,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, categoryId, imageUrl } = req.body;

    // Check if categoryId exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: `Category with id ${categoryId} not found` });
    }

    // Update product with categoryId
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price,
        quantity,
        categoryId,
        imageUrl,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Search products
const searchProducts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Add something to search' });
  }

  try {
    const products = await prisma.product.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
=======
export const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({ where: { id: Number(id) } });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'An error occurred while fetching the product.' });
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
        res.status(500).json({ error: 'An error occurred while creating the product.' });
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
        res.status(500).json({ error: 'An error occurred while updating the product.' });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({ where: { id: Number(id) } });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'An error occurred while deleting the product.' });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await prisma.product.findMany({ where: { categoryId: Number(categoryId) } });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'An error occurred while fetching products by category.' });
    }
};

export const searchProducts = async (req, res) => {
    const { search } = req.params;
    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ]
            }
        });
        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'An error occurred while searching for products.' });
    }
>>>>>>> b74b19b (do-over)
};
