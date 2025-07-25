import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatbotRoutes from '../routes/chatbotRoutes.js';

const app = express(); // <-- This should come first!

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
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/chatbot', chatbotRoutes);

// --- Import Routes with Error Handling ---
let contactRoutes;
try {
  const { default: routes } = await import('../routes/contactRoutes.js');
  contactRoutes = routes;
  console.log('✅ Contact routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load contact routes:', error.message);
  // Create fallback route
  contactRoutes = express.Router();
  contactRoutes.all('*', (req, res) => {
    res.status(500).json({
      success: false,
      message: 'Contact routes not available',
      error: 'Module loading failed'
    });
  });
}

// --- Routes ---
app.use('/api/contact', contactRoutes);

// --- Health & Info Endpoints ---
app.get('/', (req, res) => {
  res.json({
    message: 'Tagad Platforms Backend API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Tagad Platforms API v1.0',
    endpoints: ['/api/contact/submit', '/api/contact', '/api/health'],
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'Supabase',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// --- Test Route ---
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    headers: req.headers,
    query: req.query
  });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// --- 404 Handler ---
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /api',
      'GET /api/health',
      'GET /api/test',
      'POST /api/contact/submit',
      'GET /api/contact'
    ],
    timestamp: new Date().toISOString()
  });
});

// ✅ Export for Vercel Serverless
export default app;
