import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch all categories
export const getCategories = async () => {
    try {
        const categories = await prisma.category.findMany();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return null;
    }
};

// Fetch a single category by ID
export const getCategory = async (categoryId) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: Number(categoryId) }
        });
        return category;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
};

// Create a new category
export const createCategory = async (category) => {
    try {
        const newCategory = await prisma.category.create({
            data: category
        });
        return newCategory;
    } catch (error) {
        console.error('Error creating category:', error);
        return null;
    }
};

// Update an existing category
export const updateCategory = async (categoryId, category) => {
    try {
        const updatedCategory = await prisma.category.update({
            where: { id: Number(categoryId) },
            data: category
        });
        return updatedCategory;
    } catch (error) {
        console.error('Error updating category:', error);
        return null;
    }
};

// Delete a category
export const deleteCategory = async (categoryId) => {
    try {
        await prisma.category.delete({
            where: { id: Number(categoryId) }
        });
        return { message: 'Category deleted successfully' };
    } catch (error) {
        console.error('Error deleting category:', error);
        return null;
    }
};
