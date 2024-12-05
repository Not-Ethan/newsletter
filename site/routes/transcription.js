const express = require('express');
const crypto = require('crypto');
const Task = require('../models/Task');

module.exports = (redisSubmit) => {
  const router = express.Router();

  const taskList = process.env.TASK_LIST || 'transcription_urls';

  // Endpoint to submit a transcription task
  router.post('/transcribe', async (req, res) => {
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
  router.get('/summary/:id', async (req, res) => {
    let summary = await redisSubmit.get(req.params.id);

    if (!summary) {
      summary = await Task.findOne({ task_id: req.params.id });

      if (summary) {
        redisSubmit.set(req.params.id, JSON.stringify(summary), { EX: 60 * 15 });
      }
    }

    res.send(summary);
  });

  return router;
};