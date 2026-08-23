import { Schema, model } from 'mongoose';

const TaskSchema = new Schema({
  userId: {
    type: String,
    required: false,
    default: '67c100000000000000000001',
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: {
    type: String,
    default: () => new Date().toISOString()
  }
}, { timestamps: true });

export default model('Task', TaskSchema);