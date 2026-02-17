import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import { dbConnect } from './config/db.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://students-todo.vercel.app', // replace with your Vercel URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api', routes);
// Example root route
app.get('/', (req, res) => {
  res.send('Hello! MongoDB Atlas is connected and server is running.');
});

console.log("Mongo URL:", process.env.MONGO_URL);

app.use("/uploads", express.static("uploads"));


// Export for Vercel serverless deployment
export default serverless(app);


// Local testing (optional)
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
