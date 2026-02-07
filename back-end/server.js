import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import { dbConnect } from './dbConnect.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routes);

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Example root route
app.get('/', (req, res) => {
  res.send('Hello! MongoDB Atlas is connected and server is running.');
});

// Export for Vercel serverless deployment
export default serverless(app);

// Local testing (optional)
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
