const express = require('express');
const crypto = require('crypto');
const Task = require('../models/Task');
const User = require('../models/User');

module.exports = (redisSubmit) => {
  const router = express.Router();

  const taskList = process.env.TASK_LIST || 'transcription_urls';

  // Endpoint to submit a transcription task
  router.post('/transcribe', async (req, res) => {
    let user = await User.findOne({ _id: req.user._id });
    if (!user) {
      res.status(401).send('User not found');
      return;
    }

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

      //save task to db
      user.tasks.push(task._id);
      user.save();

      console.log('Task pushed to Redis:', task.task_id, taskList, pushResult);
      res.status(200).send('Task added');
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Error');
    }
  });
  // Endpoint to get the summary of a task
  router.get('/summary/id/:id', async (req, res) => {
    let id = req.user._id;
    let tasks = await User.findOne({ _id: id }).tasks;

    if(!tasks || !tasks.includes(req.params.id)){
      res.status(404).send('Task not found for user');
    }

    let summary = await redisSubmit.get(req.params.id);

    if (!summary) {
      summary = await Task.findOne({ task_id: req.params.id });

      if (summary) {
        redisSubmit.set(req.params.id, JSON.stringify(summary), { EX: 60 * 15 });
      }
    }

    res.send(summary);
  });
  router.get('/summary/all', async (req, res) => {
    try {
      let userId = req.user._id;
  
      // Fetch the user and their task list
      let user = await User.findOne({ _id: userId });
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      let taskIds = user.tasks; // Assuming this is an array of task IDs
  
      // Fetch the tasks that exist in the database
      let existingTasks = await Task.find({ _id: { $in: taskIds } });
  
      // Get the IDs of tasks that were found
      let existingTaskIds = existingTasks.map(task => task._id.toString());
  
      // Find and remove non-existent task IDs from the user's task list
      let updatedTaskIds = taskIds.filter(taskId => existingTaskIds.includes(taskId.toString()));
  
      if (updatedTaskIds.length !== taskIds.length) {
        // Update the user's task list if there are changes
        user.tasks = updatedTaskIds;
        await user.save();
      }
  
      // Return the existing tasks in JSON format
      res.json({ tasks: existingTasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "An error occurred while fetching tasks" });
    }
  });
  

  return router;
};