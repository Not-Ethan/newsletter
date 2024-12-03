
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  url: { type: String, required: true },
  task_id: { type: String, required: true },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
  content: { type: String, default: '' }
});

module.exports = mongoose.model('Task', taskSchema);