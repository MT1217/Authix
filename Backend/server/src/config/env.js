import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  /** Used in Checkout success/cancel URLs */
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
