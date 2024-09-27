import app from './app';
import config from './config';
import mongoose from 'mongoose';

async function main() {
  try {
    if (!config.db.uri) {
      throw new Error('Database URI is not defined');
    }
    await mongoose.connect(config.db.uri);
    // console.log('Database connected successfully');
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Error on server startup:', error);
  }
}

main();

// optional
process.on('SIGINT', async () => {
  // here disconnect the database and close services
  mongoose.disconnect();
  process.exit();
});

export default app;
