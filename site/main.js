const express = require('express');
const app = express();
const port = 3000;
const crypto = require('crypto');

const rd = require('redis');
const redis = rd.createClient({socket: {
  host: process.env.REDIS_HOST || 'localhost', // specify your host name here
  port: process.env.REDIS_PORT || 6379, // specify your port
}});

const taskList = process.env.TASK_LIST || 'transcription_urls';

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/transcribe', (req, res) => {
  let url = req.body['youtubeURL'];
  console.log(req.body);
  redis.lPush(taskList, JSON.stringify({
    url: url,
    task_id: crypto.randomUUID()
  }), (err, reply) => {
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

redis.connect();