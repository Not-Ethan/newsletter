const express = require('express');
const crypto = require('crypto');
const rd = require('redis');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();
const port = 3000;

const redis = rd.createClient({socket: {
  host: process.env.REDIS_HOST || 'localhost', // specify your host name here
  port: process.env.REDIS_PORT || 6379, // specify your port
}});


mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`, {});

const taskList = process.env.TASK_LIST || 'transcription_urls';
const completedList = process.env.COMPLETED_LIST || 'completed_tasks';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/transcribe', async (req, res) => {
  let url = req.body['youtubeURL'];
  console.log(req.body);
  const task = new Task({
    url: url,
    task_id: crypto.randomUUID()
  });
  try {
    await task.save();
    redis.lPush(taskList, JSON.stringify({
      url: url,
      task_id: task.task_id
    }), (err, reply) => {
      if (err) {
        console.error('Redis error:', err);
        res.status(500).send('Error');
      } else {
        res.status(200).send('Success');
      }
    });
  } catch (err) {
    console.error('MongoDB error:', err);
    res.status(500).send('Error');
  }
});

app.get('/api/summary/:id', async (req, res) => {
  console.log(req.params.id);

  //check cache first then database
  let summary = await redis.get(req.params.id);
  if (!summary) {
    summary = await Task.findOne({task_id: req.params.id})
  }

  res.send(summary);

})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.connect();

redis.on('connect', () => {
  console.log('Connected to Redis');
  const processTasks = async () => {
    while (true) {
      try {
        const message = await redis.blPop(completedList, 0);
        console.log('Received message:', message);
        const task = JSON.parse(message[1]);
        if (task.status === 'failed') {
          await Task.findOneAndDelete({ task_id: task.task_id });
          console.log('Task failed:', task.task_id);
        } else if (task.status === 'completed') {
          let taskResult = await redis.get("task:" + task.task_id);
          await Task.findOneAndUpdate({ task_id: task.task_id }, { status: 'completed', content: taskResult });
          console.log('Task completed:', task.task_id, taskResult);
        }
      } catch (err) {
        console.error('Redis error:', err);
      }
    }
  };
  processTasks();
});