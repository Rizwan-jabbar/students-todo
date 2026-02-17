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

// -------------------- DATABASE CONNECTION --------------------
// Connect once at startup instead of on every request
(async () => {
  try {
    await dbConnect();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1); // stop server if DB fails
  }
})();

// -------------------- CORS MIDDLEWARE --------------------
// Allowed origins (add all dev URLs you use)
const allowedOrigins = [
  'https://students-todo.vercel.app', // production frontend
  'http://localhost:3000',             // local React
  'http://127.0.0.1:5173',             // Vite dev server, if used
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server requests (Postman, curl) which have no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log('Blocked CORS request from origin:', origin);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

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
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}
