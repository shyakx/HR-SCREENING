import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      return res.status(500).json({
        success: false,
        message: 'MONGODB_URI not found in environment variables'
      });
    }

    // Test connection
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    
    // Test a simple operation
    let collections: string[] = [];
    if (mongoose.connection.db) {
      const collectionData = await mongoose.connection.db.listCollections().toArray();
      collections = collectionData.map((c: any) => c.name);
    }
    
    await mongoose.disconnect();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      host: conn.connection.host,
      collections
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
}
