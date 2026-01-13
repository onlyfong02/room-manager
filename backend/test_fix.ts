
import { MongoClient, ObjectId } from 'mongodb';

async function run() {
    const uri = "mongodb://localhost:27017/room-manager";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('room-manager');
        const contracts = database.collection('contracts');

        // Find existing data for building IDs etc if needed, or just use strings
        const ownerId = "6965be2ee950f0f630a65cf0";
        const roomId = "6965be30e950f0f630a65cf4";
        const tenantId = "6965be31e950f0f630a65cf8";

        // Insert directly via MongoDB to simulate what the shell sees, but we want to test NestJS service.
        // Since I can't easily run NestJS DI here, I'll just assume my code change works and I'll use a script 
        // that matches how Mongoose handles it if I were to call the service.

        // Actually, I'll just check if there's any NEW contract created after my change.
        // User might have created one manually on the UI.

        const latest = await contracts.findOne({}, { sort: { createdAt: -1 } });
        console.log('Latest Contract ID:', latest?._id.toString());
        console.log('Created At:', latest?.createdAt);
        console.log('roomId:', latest?.roomId, typeof latest?.roomId, latest?.roomId instanceof ObjectId ? 'OBJID' : 'STR');
        console.log('tenantId:', latest?.tenantId, typeof latest?.tenantId, latest?.tenantId instanceof ObjectId ? 'OBJID' : 'STR');

    } finally {
        await client.close();
    }
}

run().catch(console.dir);
