import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const debugDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to:', process.env.MONGO_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        for (const colName of ['users', 'User']) {
             const col = mongoose.connection.db.collection(colName);
             const count = await col.countDocuments();
             console.log(`Collection [${colName}] count:`, count);
             if (count > 0) {
                 const docs = await col.find({}).toArray();
                 console.log(`Docs in [${colName}]:`, JSON.stringify(docs, null, 2));
             }
        }
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugDB();
