import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import { dbConnect } from './config/db.js';

dotenv.config();

const app = express();

// -------------------- CORS CONFIGURATION --------------------
const corsOptions = {
  origin: 'https://students-todo.vercel.app', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// -------------------- BODY PARSER --------------------
app.use(express.json());

// -------------------- DATABASE CONNECTION --------------------
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

// Root route
app.get('/', (req, res) => {
  res.send('Hello! MongoDB Atlas is connected and server is running.');
});

// -------------------- STATIC FILES --------------------
app.use("/uploads", express.static("uploads"));

// -------------------- SERVERLESS EXPORT --------------------
export default serverless(app);

// -------------------- LOCAL TESTING --------------------
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
