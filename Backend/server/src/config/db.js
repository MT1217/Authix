import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Establishes a single shared connection to MongoDB.
 * All Mongoose models share this connection; every query should still filter by tenantId
 * so data from different organizations never mixes in application logic.
 */
export async function connectDb() {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI missing in environment');
  }

  await mongoose.connect(env.mongoUri);
}
