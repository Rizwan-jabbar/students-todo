import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import { dbConnect } from './config/db.js';

dotenv.config();

const app = express();

// -------------------- CORS --------------------
const corsOptions = {
  origin: ['http://localhost:3000', 'https://students-todo.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests
app.options('*', cors(corsOptions)); 

// -------------------- BODY PARSER --------------------
app.use(express.json());

// -------------------- DATABASE --------------------
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// -------------------- ROUTES --------------------
app.use('/api', routes);

// Root
app.get('/', (req, res) => {
  res.send('Server running!');
});

// Static files
app.use('/uploads', express.static('uploads'));

// -------------------- SERVERLESS EXPORT --------------------
export default serverless(app);

// Local test
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on ${port}`));
}
