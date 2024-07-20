import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const {firstname, lastname, phone, email, password, role } = req.body;
    
    // Default role to 'USER' if not provided
    const userRole = role ? role.toUpperCase() : "USER";
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        phone,
        email,
        password: hashedPassword,
        role: userRole,
      },
    });
    
    // Generate a JWT token
    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "45m",
    });
    
    // Respond with the access token and user data
    res.status(201).json({ accessToken, user: newUser });
  } catch (error) {
    console.error("Error in register function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("Invalid Credentials: User not found");
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    
    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      // Generate a JWT token
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "45m",
      });
      
      // Respond with the access token and user data
      res.status(200).json({ accessToken, user });
    } else {
      console.log("Invalid Credentials: Incorrect password");
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Error in login function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Simply respond with a success message; logout functionality usually involves token invalidation on the client side
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in logout function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
