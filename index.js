/*
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import contactRoutes from '../routes/contactRoutes.js'; // ✅ CORRECT

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ Blocked by CORS: ${origin}`);
      callback(new Error(`CORS policy: Origin ${origin} not allowed.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/contact', contactRoutes);

// --- Health & Info Endpoints ---
app.get('/', (req, res) => {
  res.json({
    message: 'Tagad Platforms Backend API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Tagad Platforms API v1.0',
    endpoints: ['/api/contact/submit', '/api/contact'],
    status: 'operational'
  });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// --- 404 Handler (Express 5 compatible) ---
app.all('/{*any}', (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
    availableEndpoints: [
      '/api/contact/submit',
      '/api/contact',
      '/api/health'
    ]
  });
});

// --- Start the server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app; // (optional, for testing)

*/

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import contactRoutes from './routes/contactRoutes.js';


const app = express();

// --- CORS Configuration ---
// --- CORS Configuration ---
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://www.tagadplatforms.com', // Add your production domain
  'https://tagadplatforms.com' // Add root domain too
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || 
        origin.endsWith('.tagadplatforms.com')) { // Allow subdomains
      return callback(null, true);
    }
    
    // For development, you might want to see blocked origins
    console.warn('Blocked by CORS:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/contact', contactRoutes);

// --- Health & Info Endpoints ---
app.get('/', (req, res) => {
  res.json({
    message: 'Tagad Platforms Backend API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Tagad Platforms API v1.0',
    endpoints: ['/api/contact/submit', '/api/contact'],
    status: 'operational'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'Supabase connected',
    timestamp: new Date().toISOString()
  });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// --- 404 Handler (Express 5 compatible) ---
app.all('/{*any}', (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
    availableEndpoints: [
      '/',
      '/api',
      '/api/health',
      '/api/contact/submit',
      '/api/contact'
    ]
  });
});

// ✅ VERCEL EXPORT (NO app.listen for serverless)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
