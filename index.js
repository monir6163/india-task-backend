const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r1nyd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// backend work 
async function run() {
    try {
        await client.connect();
        const database = client.db('task');
        const usersCollection = database.collection('users');

        // user add api 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        });
        //all user get api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const allUser = await cursor.toArray();
            res.json(allUser)
        });
        // user delete api 
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

// default api check run server
app.get('/', (req, res) => {
    res.send('Running Node Servers')
});
app.listen(port, () => {
    console.log('Task Users port', port)
})