const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middeleware
app.use(cors(
  {
    orgin: ["http://localhost:5173","https://tour-of-south-asia-server.vercel.app",  ]
  }
));
app.use(express.json());








app.get('/', (req, res)=>{
    res.send('Tourist Of South Asia Server is Running website')
})

app.listen(port, ()=>{
    console.log(`Tourist Of South Asia Server on Running: ${port}`);
})



// use Mongodb======================================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ehqhw1m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(process.env.DB_USER, );
console.log(process.env.DB_PASS);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

const tourCollection = client.db('tourismDB').collection('tourism');
const tourFeedback = client.db('tourismDB').collection('feedback');

app.get('/addspot', async(req, res)=>{
    const cursor = tourCollection.find();
    const result = await cursor.toArray();
    res.send(result)
})



app.get('/myList/:email', async(req, res)=>{
  console.log(req.params.email);
  const result = await tourCollection.find({ email: req.params.email }).toArray();
  res.send(result)
})

app.get('/category/countryName', async(req, res)=>{
  console.log(req.params.countryName);
  const result = await tourCollection.find({countryName: req.params.email}).toArray();
  res.send(res)
})

app.get('/addspot/:id', async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await tourCollection.findOne(query)
  res.send(result)
  console.log(result);
})


app.post('/addspot', async(req, res)=>{
    const newSpot = req.body;
    console.log(newSpot);
    const result = await tourCollection.insertOne(newSpot);
    res.send(result);
    console.log(result);
})


// feedback start ===================================================

app.get('/user', async(req, res)=>{
  const cursor = tourFeedback.find();
  const result = await cursor.toArray();
  res.send(result)
})


app.post('/user', async(req, res)=>{
  const feedback = req.body;
  console.log(feedback);
  const result = await tourFeedback.insertOne(feedback);
  res.send(result);
  console.log(result);
})



app.put('/addspot/:id', async(req, res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert: true};
  const updatedSpot= req.body;
  const tourist  = {
    $set: {
      photo: updatedSpot.photo,
       spotName: updatedSpot.spotName,
       countryName: updatedSpot.countryName,
       location: updatedSpot.location,
       cost: updatedSpot.cost,
       seasonality: updatedSpot.seasonality,
       time: updatedSpot.time,
       perYear: updatedSpot.perYear,
       email: updatedSpot.email,
       userName: updatedSpot.userName,
       description: updatedSpot.description,
    }
  }
  const result = await tourCollection.updateOne(filter, tourist, options);
  res.send(result);
})



app.delete('/addspot/:id', async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await tourCollection.deleteOne(query);
  res.send(result);
})


    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
