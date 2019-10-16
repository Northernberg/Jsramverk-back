var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'chat';

async function findInCollection(search, projection, sort, limit) {
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = await client.db(dbName);
    const col = await db.collection('chatHistory');
    const res = await col
        .find(search)
        .project(projection)
        .sort(sort)
        .limit(limit)
        .toArray();

    await client.close();

    return res;
}

async function insertInCollection(message) {
    const client = await MongoClient.connect(url);
    const db = await client.db(dbName);
    const col = await db.collection('chatHistory');
    const res = await col.insertOne(message);

    await client.close();

    return res;
}

router.get('/', (req, res) => {
    findInCollection({}, {}, { _id: -1 }, 20)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            return res.status(404).json(err.message);
        });
});

router.post('/insert', (req, res) => {
    insertInCollection(req.body.message)
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            return res.status(404).json(err.message);
        });
});

module.exports = router;
