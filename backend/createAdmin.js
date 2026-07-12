import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB:', process.env.MONGO_URI);

        const email = 'admin@clinic.com';
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log('Admin already exists in this database.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            name: 'Admin User',
            email: email,
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('Admin account created successfully in [users] collection.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
