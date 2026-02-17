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
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',                // local dev
  'http://127.0.0.1:5173',                // Vite dev server
  'https://students-todo.vercel.app'      // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests like Postman / server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked CORS request from origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,  // optional if you send cookies
}));

// Handle OPTIONS preflight requests explicitly
app.options('*', cors());


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
