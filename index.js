const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.17kk4sr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // 
        const productCategoriesCollection = client.db('Rapid-Reselling').collection('all-categories');
        const allProductsCollection = client.db('Rapid-Reselling').collection('all-products');



        // get all categories from db
        app.get('/productCategories', async (req, res) => {
            const query = {}
            const cursor = productCategoriesCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // get review for specific id from db
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { category_id: id }
            const cursor = allProductsCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
    }

    finally {

    }
}

run().catch(err => console.log(err))




app.get('/', (req, res) => {
    res.send('rapid reselling server is running...')
})

app.listen(port, () => console.log('The server is running on port', port))