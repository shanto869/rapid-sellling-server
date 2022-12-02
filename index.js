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


// jwt verify 
// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send('unauthorized access')
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
//         if (err) {
//             return res.status(403).send({ message: 'forbidden access' })
//         }
//         req.decoded = decoded;
//         next()
//     })

// }


async function run() {
    try {
        // 
        const productCategoriesCollection = client.db('Rapid-Reselling').collection('all-categories');
        const allProductsCollection = client.db('Rapid-Reselling').collection('all-products');
        const bookingCollection = client.db('Rapid-Reselling').collection('user-booking');
        const advertiseCollection = client.db('Rapid-Reselling').collection('advertise-products');



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

        // jwt token
        // app.get('/jwt', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query)
        //     if (user) {
        //         const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
        //         return res.send({ accessToken: token });
        //     }
        //     res.status(403).send({ accessToken: '' })
        // })

        // get order data form db
        app.get('/orders', async (req, res) => {
            const query = {}
            const orders = await bookingCollection.find(query).toArray()
            res.send(orders)
        })

        // get advertise products 
        app.get('/advertise_products', async (req, res) => {
            const query = {}
            const advertiseProducts = await advertiseCollection.find(query).toArray()
            res.send(advertiseProducts)
        })

        // 
        app.get('/booking', async (req, res) => {
            const query = {}
            const bookingProducts = await bookingCollection.find(query).toArray()
            res.send(bookingProducts)
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