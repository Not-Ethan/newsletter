const express = require('express');
const crypto = require('crypto');
const rd = require('redis');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();
const port = 3000;

// Redis clients for submitting and processing tasks
const redisSubmit = rd.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

const redisProcess = rd.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

// MongoDB connection
mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`, {});

// Task lists
const taskList = process.env.TASK_LIST || 'transcription_urls';
const completedList = process.env.COMPLETED_LIST || 'completed_tasks';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Endpoint to submit a transcription task
app.post('/api/transcribe', async (req, res) => {
  let url = req.body['youtubeURL'];
  console.log(req.body);

  const task = new Task({
    url: url,
    task_id: crypto.randomUUID(),
  });

  try {
    await task.save();
    console.log('Task saved:', task.task_id, taskList);
    console.log('Preparing to push task to Redis...');

    const taskData = JSON.stringify({
      url: url,
      task_id: task.task_id,
    });

    console.log('Task data:', taskData);

    const pushResult = await Promise.race([
      redisSubmit.lPush(taskList, taskData),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Redis lPush timeout')), 5000)),
    ]);

    console.log('Task pushed to Redis:', task.task_id, taskList, pushResult);
    res.status(200).send('Task added');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error');
  }
});

// Endpoint to get the summary of a task
app.get('/api/summary/:id', async (req, res) => {

  // Check cache first, then database
  let summary = await redisSubmit.get(req.params.id);

  if (!summary) {
    summary = await Task.findOne({ task_id: req.params.id });

    //cache miss, cache the result
    if (summary) {
      redisSubmit.set(req.params.id, JSON.stringify(summary), { EX: 60*15 });
    }
  }

  res.send(summary);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Redis event handlers for submitting tasks
redisSubmit.on('error', (err) => {
  console.error('Redis error:', err);
});

redisSubmit.on('connect', () => {
  console.log('Connected to Redis for submitting tasks');
});

// Redis event handlers for processing tasks
redisProcess.on('error', (err) => {
  console.error('Redis error:', err);
});

redisProcess.on('connect', () => {
  console.log('Connected to Redis for processing tasks');

  const processTasks = async () => {
    while (true) {
      try {
        const message = await redisProcess.blPop(completedList, 0);
        console.log('Received message:', message);

        if (message && message.element) {
          const task = JSON.parse(message.element);

          if (task.status === 'failed') {
            await Task.findOneAndDelete({ task_id: task.task_id });
            console.log('Task failed:', task.task_id);
          } else if (task.status === 'completed') {
            let taskResult = await redisProcess.get("task:" + task.task_id);
            await Task.findOneAndUpdate({ task_id: task.task_id }, { status: 'completed', content: taskResult });

          }
        } else {
          console.error('Received invalid message:', message);
        }
      } catch (err) {
        console.error('Redis error:', err);
      }
    }
  };

  processTasks();
});

// Connect to Redis
redisSubmit.connect();
redisProcess.connect();
