import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getProfiles = async (req, res) => {
    try {
        const profiles = await prisma.profile.findMany();
        res.status(200).json(profiles);
    } catch (error) {
        console.error('Error getting profiles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await prisma.profile.findUnique({
            where: { id: parseInt(id) },
        });
        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
        } else {
            res.status(200).json(profile);
        }
    } catch (error) {
        console.error('Error getting profile by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createProfile = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Implement password hashing and validation here if not already done
        
        const newProfile = await prisma.profile.create({
            data: { name, email, password, role },
        });
        res.status(201).json(newProfile);
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        // Implement password hashing and validation here if not already done
        
        const updatedProfile = await prisma.profile.update({
            where: { id: parseInt(id) },
            data: { name, email, password, role },
        });
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.profile.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default { getProfiles, getProfileById, createProfile, updateProfile, deleteProfile };
