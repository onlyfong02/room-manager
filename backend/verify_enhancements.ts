
import { MongoClient, ObjectId } from 'mongodb';

async function run() {
    const uri = "mongodb://localhost:27017/room-manager";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('room-manager');
        const contracts = database.collection('contracts');

        // Find latest contract to check for code
        const latest = await contracts.findOne({}, { sort: { createdAt: -1 } });
        console.log('--- Latest Contract ---');
        console.log('ID:', latest?._id.toString());
        console.log('Code:', latest?.contractCode);
        console.log('Created At:', latest?.createdAt);
        console.log('roomId:', latest?.roomId instanceof ObjectId ? 'OBJID' : 'STR');

        // Count total
        const count = await contracts.countDocuments({ isDeleted: false });
        console.log('\nTotal active contracts:', count);

    } finally {
        await client.close();
    }
}

run().catch(console.dir);
