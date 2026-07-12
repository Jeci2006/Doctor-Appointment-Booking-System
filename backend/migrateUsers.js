import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to:', process.env.MONGO_URI);
        
        const db = mongoose.connection.db;
        const sourceCol = db.collection('User');
        const targetCol = db.collection('users');
        
        const admin = await sourceCol.findOne({ email: 'admin@clinic.com' });
        if (admin) {
            console.log('Found admin in [User] collection. Migrating...');
            
            // Check if admin already exists in target
            const exists = await targetCol.findOne({ email: 'admin@clinic.com' });
            if (!exists) {
                await targetCol.insertOne(admin);
                console.log('Admin migrated to [users] collection.');
            } else {
                console.log('Admin already exists in [users] collection.');
            }
            
            // Optionally remove from source
            // await sourceCol.deleteOne({ _id: admin._id });
        } else {
            console.log('Admin not found in [User] collection.');
        }
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migrate();
