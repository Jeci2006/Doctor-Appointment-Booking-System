import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const verifyCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Collections in:', process.env.MONGO_URI);
        
        for (let col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(` - [${col.name}]: ${count} docs`);
            if (col.name === 'users') {
                const admin = await db.collection('users').findOne({ role: 'admin' });
                console.log('   Admin found:', admin ? 'YES' : 'NO');
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
verifyCounts();
