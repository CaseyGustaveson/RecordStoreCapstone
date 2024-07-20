import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { firstname, lastname, phone, email, password, role } = req.body;
    const userRole = role ? role.toUpperCase() : 'USER';

    const hashedPassword = await bcrypt.hash(password, 10);
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

    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45m' });

    res.status(201).json({ accessToken, user: newUser });
  } catch (error) {
    console.error('Error in register function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid Credentials' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ error: 'Invalid Credentials' });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45m' });

    res.status(200).json({ accessToken, user });
  } catch (error) {
    console.error('Error in login function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in logout function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
