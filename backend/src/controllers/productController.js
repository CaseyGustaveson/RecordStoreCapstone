import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
};