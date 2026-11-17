import { createApp } from './app.js';
import { connectDatabase } from './database/connection.js';

const port = Number(process.env.PORT) || 3000;

try {
  await connectDatabase();
  const { app } = createApp();
  app.listen(port, () => {
    console.log(`Task Manager API is running at http://localhost:${port}`);
  });
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exitCode = 1;
}
