import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const dumpUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB:', process.env.MONGO_URI);

        const email = 'admin@clinic.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log('User found:');
            console.log('ID:', user._id);
            console.log('Email:', user.email);
            console.log('Role:', user.role);
            console.log('Password hash:', user.password);
        } else {
            console.log('User not found with email:', email);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error dumping user:', error);
        process.exit(1);
    }
};

dumpUser();
