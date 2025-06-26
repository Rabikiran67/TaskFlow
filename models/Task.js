const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  // --- NEW FIELDS ---
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'], // Only allow these values
    default: 'Medium',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  // --- END NEW FIELDS ---
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;