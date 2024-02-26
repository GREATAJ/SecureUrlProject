const express = require('express');
const mongoose = require('mongoose');
const cryptoNode = require('crypto');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://<username>:<password>@cluster0.kprtr1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }}, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // 30 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds timeout
 }
);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  hashedUrl: String,
  clicks: { type: Number, default: 0 },
});

const UrlModel = mongoose.model('Url', urlSchema);

const generateHash = (originalUrl) => {
  const hash = cryptoNode.createHash('sha256');
  hash.update(originalUrl);
  return hash.digest('hex');
};

app.post('/api/hash', async (req, res) => {
  const { originalUrl } = req.body;
  const hashedUrl = generateHash(originalUrl);
  try {
    const url = new UrlModel({ originalUrl, hashedUrl });
    await url.save();
    res.json({ hashedUrl });
  } catch (error) {
    console.error('Error saving hashed URL to database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
