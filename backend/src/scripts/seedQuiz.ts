import mongoose from 'mongoose';
import { connectDB } from '../utils/database';
import { seedQuizQuestions } from '../data/sampleQuizQuestions';

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    await seedQuizQuestions();
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
