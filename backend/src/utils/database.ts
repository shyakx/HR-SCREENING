import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hr-screening';
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Keep trying for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('Database connection error:', error.message);
    // Don't exit in serverless, just log the error
    // process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error: any) {
    console.error('Database disconnection error:', error.message);
  }
};
