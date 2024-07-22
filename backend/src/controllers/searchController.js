import { PrismaClient } from '@prisma/client';
<<<<<<< HEAD
const prisma = new PrismaClient();
=======

>>>>>>> b74b19b (do-over)



const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        const products = await prisma.product.findMany({
        where: {
            OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            ],
        },
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
    
const searchProductsByCategory = async (req, res) => {
    try {
        const { q, category } = req.query;
        const products = await prisma.product.findMany({
        where: {
            AND: [
            {
                OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                ],
            },
            { categoryId: parseInt(category) },
            ],
        },
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products by category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const searchProductsByCategoryAndSort = async (req, res) => {
    try {
        const { q, category, sort } = req.query;
        const products = await prisma.product.findMany({
        where: {
            AND: [
            {
                OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                ],
            },
            { categoryId: parseInt(category) },
            ],
        },
        orderBy: {
            name: sort === 'alphabetical' ? 'asc' : 'desc',
        },
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products by category and sort:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const searchProductsByCategorySortAndPrice = async (req, res) => {
    try {
        const { q, category, sort, minPrice, maxPrice } = req.query;
        const products = await prisma.product.findMany({
        where: {
            AND: [
            {
                OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                ],
            },
            { categoryId: parseInt(category) },
            { price: { gte: parseFloat(minPrice) || 0, lte: parseFloat(maxPrice) || Infinity } },
            ],
        },
        orderBy: {
            name: sort === 'alphabetical' ? 'asc' : 'desc',
        },
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products by category, sort, and price:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export { searchProducts, searchProductsByCategory, searchProductsByCategoryAndSort, searchProductsByCategorySortAndPrice };


export default { searchProducts, searchProductsByCategory, searchProductsByCategoryAndSort, searchProductsByCategorySortAndPrice };