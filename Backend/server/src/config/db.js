import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI missing in environment');
  }

  await mongoose.connect(env.mongoUri);
}
