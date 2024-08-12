import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetDatabase() {
  await prisma.$executeRaw`BEGIN`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`COMMIT`;
}

async function seedDatabase() {
  try {
    await resetDatabase();

    // Create categories
    const categoriesData = Array.from({ length: 3 }, (_, index) => ({
      name: `Category ${index + 1}`,
    }));

    let createdCategories = [];
    for (const categoryData of categoriesData) {
      const category = await prisma.category.create({
        data: categoryData,
      });
      createdCategories.push(category);
    }
    console.log("Categories created:", createdCategories);

    // Prevent the script from continuing if categories are not created
    if (!Array.isArray(createdCategories)) {
      throw new Error("Failed to create categories.");
    }

    // Create users
    const Role = {
      USER: "USER",
      ADMIN: "ADMIN",
    };

    const seedUsers = async () => {
      const users = [
        {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@example.com',
          password: await bcrypt.hash('password123', 10),
        },
        {
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane.smith@example.com',
          password: await bcrypt.hash('securePassword', 10),
        },
        {
          firstname: 'Admin',
          lastname: 'User',
          email: 'testadmin@test.com',
          password: await bcrypt.hash('adminPassword', 10),
          role: Role.ADMIN,
        }
      ];

      const createdUsers = [];
      for (const user of users) {
        const createdUser = await prisma.user.create({
          data: user,
        });
        createdUsers.push(createdUser);
      }

      return createdUsers; // Return the created users array
    };

    // Wait for seedUsers to complete and get the created users
    const createdUsers = await seedUsers();
    console.log("Users created:", createdUsers);

    // Create products
    const productsData = createdCategories.map((category, index) => ({
      name: `Product ${index + 1}`,
      releaseYear: `Release Year ${index + 1}`,
      price: (index + 1) * 10 - 0.01,
      quantity: index + 1,
      categoryId: category.id,
    }));

    let createdProducts = [];
    for (const productData of productsData) {
      const product = await prisma.product.create({
        data: productData,
      });
      createdProducts.push(product);
    }
    console.log("Products created:", createdProducts);

    // Ensure products are created successfully
    if (createdProducts.length === 0) {
      throw new Error("No products created.");
    }

    // Create cart items
    const cartItemsData = createdProducts.map((product, index) => ({
      quantity: index + 1,
      productId: product.id,
      userId: createdUsers[index % createdUsers.length].id, // Use createdUsers here
    }));

    const createdCartItems = await prisma.cartItem.createMany({
      data: cartItemsData,
    });
    console.log("Cart items created:", createdCartItems);

  

    seedDatabase();
  }
  catch (error) {
    console.error(error);
  }
  finally {
    await prisma.$disconnect();
  }
}


