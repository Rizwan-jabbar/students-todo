import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/routes.js';
import { dbConnect } from './config/db.js';

dotenv.config();
const app = express();

// -------------------- BODY PARSER --------------------
app.use(express.json());

// -------------------- CORS MIDDLEWARE --------------------
const allowedOrigins = [
  'https://students-todo.vercel.app', // production frontend
  'http://localhost:3000'             // local frontend for dev
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// -------------------- DATABASE CONNECTION --------------------
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// -------------------- API ROUTES --------------------
app.use('/api', routes);

// -------------------- ROOT ROUTE --------------------
app.get('/', (req, res) => res.send('Server running!'));

// -------------------- STATIC FILES --------------------
app.use('/uploads', express.static('uploads'));

// -------------------- SERVERLESS EXPORT --------------------
export default serverless(app);

// -------------------- LOCAL DEVELOPMENT --------------------
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on ${port}`));
}
