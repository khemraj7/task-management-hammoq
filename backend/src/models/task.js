import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, versionKey: false }
);

export const Task = mongoose.model('Task', taskSchema);
