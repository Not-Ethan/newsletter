const express = require('express');
const app = express();
const port = 3000;

const rd = require('redis');
const redis = rd.createClient({
  host: process.env.REDIS_HOST || 'localhost', // specify your host name here
  port: process.env.REDIS_PORT || 6379, // specify your port
});

const taskList = process.env.TASK_LIST || 'transcribe';

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/transcribe', (req, res) => {
  let url = req.body.youtubeUrl;
  redis.lPush('transcribe', url, (err, reply) => {
    if (err) {
      console.error('Redis error:', err);
      res.status(500).send('Error');
    } else {
      res.status(200).send('Success');
    }
  });
})

app.get('/api/summary/:id', (req, res) => {
  console.log(req.params.id);
  //fetch summary from database
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});