const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  url: String,
  task_id: String,
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
  content: String,
});

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);