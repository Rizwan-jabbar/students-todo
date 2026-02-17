import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import { dbConnect } from './config/db.js';

dotenv.config();
const app = express();

// Body parser
app.use(express.json());

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// -------------------- SIMPLE CORS --------------------
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://students-todo.vercel.app'); // frontend URL
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  // OPTIONS request ke liye early return
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// API routes
app.use('/api', routes);

// Root
app.get('/', (req, res) => res.send('Server running!'));

// Static files
app.use('/uploads', express.static('uploads'));

// Serverless export
export default serverless(app);

// Local testing
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on ${port}`));
}
