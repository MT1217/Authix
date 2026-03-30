import cors from 'cors';
import express from 'express';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { checkTenant } from './middleware/checkTenant.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Every request must declare tenant context to avoid cross-organization reads/writes.
app.use(checkTenant);

app.get('/', (req, res) => {
  console.log("Hello ji");
  res.send("Hello ji");
});

app.get('/health', (req, res) => res.json({ status: 'ok', tenantId: req.tenantId }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/student', studentRoutes);

async function start() {
  await connectDb();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Authix server running on port ${env.port}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Server startup failed', error);
  process.exit(1);
});
