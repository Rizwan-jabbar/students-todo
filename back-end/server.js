import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cors from 'cors';
import routes from './routes/routes.js';
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
    process.exit(1);
  }
})();

// -------------------- MIDDLEWARE --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- CORS --------------------
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://students-todo.vercel.app'
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// -------------------- ROUTES --------------------
app.use('/api', routes);
app.get('/', (req, res) => res.send('Server running!'));

// -------------------- SERVERLESS EXPORT --------------------
export default serverless(app);

// -------------------- LOCAL DEV SERVER --------------------
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}
