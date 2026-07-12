import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const exhaustiveTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB:', process.env.MONGO_URI);

        const email = 'admin@clinic.com';
        const role = 'admin';
        const password = 'admin123';

        console.log(`Searching for User with Email: [${email}], Role: [${role}]`);
        const user = await User.findOne({ email, role });

        if (!user) {
            console.log('ERROR: User NOT FOUND in database!');
            // List all users to see what is there
            const allUsers = await User.find({});
            console.log('All users in collection:', allUsers.map(u => ({ email: u.email, role: u.role })));
            process.exit(1);
        }

        console.log('SUCCESS: User found in database.');
        console.log('Role in DB:', user.role);
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log('SUCCESS: Password MATCHES.');
        } else {
            console.log('ERROR: Password DOES NOT MATCH.');
            console.log('Stored Hash:', user.password);
        }

        process.exit(0);
    } catch (error) {
        console.error('CRITICAL ERROR:', error);
        process.exit(1);
    }
};

exhaustiveTest();
