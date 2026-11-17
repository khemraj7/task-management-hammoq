import mongoose from 'mongoose';

const defaultMongoUri = 'mongodb://127.0.0.1:27017/task_manager';

export async function connectDatabase(
  mongoUri = process.env.MONGODB_URI || defaultMongoUri
) {
  await mongoose.connect(mongoUri);
  return mongoose.connection;
}
