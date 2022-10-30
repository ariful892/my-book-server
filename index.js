const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhwgtx0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const postCollection = client.db('my_book').collection('posts');

        app.get('/post', async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const posts = await cursor.toArray();
            res.send(posts.reverse());
        })

        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        })

        app.get('/post/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { email: email };
            const post = await postCollection.find(query).toArray();
            res.send(post);
        })

        app.put('/post/:id', async (req, res) => {
            const id = req.params.id;
            const likes = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: { likes: likes },
            };
            const result = await postCollection.updateOne(filter, updateDoc, options);
            return res.send(result);

        });




        // app.get('/course/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: (id) };
        //     const course = await courseCollection.findOne(query);
        //     res.send(course);

        // app.get('/booking/:email', verifyJWT, async (req, res) => {
        //     const email = req.params.email;
        //     const decodedEmail = req.decoded.email;
        //     if (email === decodedEmail) {
        //         const query = { email: email };
        //         const bookings = await bookingCollection.find(query).toArray();
        //         res.send(bookings);
        //     }
        //     else {
        //         return res.status(403).send({ message: 'Forbidden access' });
        //     }

        // })

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from My Book!')
})

app.listen(port, () => {
    console.log(`My Book app listening on port ${port}`)
})