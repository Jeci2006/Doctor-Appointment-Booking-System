import mongoose from 'mongoose';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const testPersistence = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB:', process.env.MONGO_URI);

        const email = 'dr_test@clinic.com';
        await User.deleteOne({ email });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const user = await User.create({
            name: 'Test Doctor',
            email: email,
            password: hashedPassword,
            role: 'doctor'
        });

        console.log('User created:', user._id);

        const doctor = await Doctor.create({
            user: user._id,
            specialization: 'General',
            experience: 5,
            phone: '1234567890',
            fee: 100,
            isApproved: true
        });

        console.log('Doctor created:', doctor._id);
        
        const count = await Doctor.countDocuments();
        console.log('Doctor collection count:', count);

        process.exit(0);
    } catch (error) {
        console.error('Test Error:', error);
        process.exit(1);
    }
};

testPersistence();
