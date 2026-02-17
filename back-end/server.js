// server.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cors from 'cors';
import routes from './routes/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary} from 'cloudinary'

const app = express();


cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  API_key : process.env.CLOUDINARY_API_KEY,
  API_secret : process.env.CLOUDINARY_API_SECRET
})

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// -------------------- SERVE UPLOADS --------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// -------------------- CORS --------------------
const allowedOrigins = [
  'http://localhost:3000',                // local dev
  'http://127.0.0.1:5173',                // Vite dev server
  'https://students-todo.vercel.app'      // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / server-to-server requests
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log('Blocked CORS request from origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));





// -------------------- ROUTES --------------------
app.use('/api', routes);
app.get('/', (req, res) => res.send('Server running!'));

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
