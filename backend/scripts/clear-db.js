const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'room-manager';

async function clearDatabase() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        await db.dropDatabase();

        console.log(`✅ Database '${dbName}' has been cleared successfully!`);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
    } finally {
        await client.close();
    }
}

clearDatabase();
