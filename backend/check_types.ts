
import { MongoClient, ObjectId } from 'mongodb';

async function run() {
    const uri = "mongodb://localhost:27017/room-manager";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('room-manager');
        const contracts = database.collection('contracts');

        const c = await contracts.findOne({}, { sort: { createdAt: -1 } });
        if (c) {
            console.log('ID:', c._id.toString());
            console.log('roomId:', c.roomId, typeof c.roomId, c.roomId instanceof ObjectId ? 'OBJID' : 'STR');
            console.log('tenantId:', c.tenantId, typeof c.tenantId, c.tenantId instanceof ObjectId ? 'OBJID' : 'STR');
            console.log('ownerId:', c.ownerId, typeof c.ownerId, c.ownerId instanceof ObjectId ? 'OBJID' : 'STR');
        } else {
            console.log('No contracts found');
        }

    } finally {
        await client.close();
    }
}

run().catch(console.dir);
