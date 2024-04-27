const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middeleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Tourist Of South Asia Server is Running')
})

app.listen(port, ()=>{
    console.log(`Tourist Of South Asia Server on Running: ${port}`);
})
