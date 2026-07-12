import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const cols = await db.listCollections().toArray();
        console.log('Database State Check:');
        for (let c of cols) {
            const count = await db.collection(c.name).countDocuments();
            console.log(` - ${c.name}: ${count} documents`);
            const latest = await db.collection(c.name).find().sort({_id: -1}).limit(1).toArray();
            if (latest.length > 0) {
                console.log(`   Latest entry:`, JSON.stringify(latest[0], (k,v) => k === 'password' ? '***' : v).substring(0, 100));
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
checkDB();
