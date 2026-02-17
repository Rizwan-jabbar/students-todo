import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cors from 'cors';
import routes from './routes/routes.js'; // your todo API routes
import serverless from 'serverless-http';

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- DATABASE CONNECTION --------------------
(async () => {
  try {
    await connectDB();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1); // stop server if DB fails
  }
})();

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- CORS --------------------
app.use(cors({
  origin: [
    'http://localhost:3000',                // local React
    'http://127.0.0.1:5173',                // Vite dev server
    'https://students-todo.vercel.app'      // production frontend
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// -------------------- API ROUTES --------------------
app.use('/api', routes);

// -------------------- TEST ROUTE --------------------
app.get('/', (req, res) => res.send('Server running!'));

// -------------------- SERVERLESS EXPORT --------------------
if (process.env.NODE_ENV === 'production') {
  export default serverless(app);
} else {
  // -------------------- LOCAL DEVELOPMENT --------------------
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}
