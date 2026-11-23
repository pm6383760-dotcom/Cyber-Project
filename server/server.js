require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Connect Database (with automatic fallback mode if MongoDB daemon isn't running)
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/system', systemRoutes);

// Root info route
app.get('/api', (req, res) => {
  res.json({
    project: 'PhishGuard AI',
    tagline: 'AI-Powered Phishing URL Detection & Cyber Threat Analysis System',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (register, login, me, demo-credentials)',
      scans: '/api/scans (analyze, history, analytics, export/csv)',
      system: '/api/system (health, model-info)'
    },
    documentation: 'https://github.com/pm6383760-dotcom/Cyber-Project'
  });
});

// Serve static frontend build if present in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>PhishGuard AI - API Server Running</title>
            <style>
              body { background: #0B0F19; color: #E2E8F0; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background: #111827; border: 1px solid #1F2937; padding: 2.5rem; border-radius: 1rem; max-width: 550px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
              h1 { color: #00F0FF; margin-bottom: 0.5rem; font-size: 1.8rem; }
              p { color: #94A3B8; line-height: 1.6; }
              .badge { display: inline-block; background: #064E3B; color: #34D399; padding: 0.35rem 0.8rem; border-radius: 9999px; font-size: 0.85rem; font-weight: bold; margin-bottom: 1rem; }
              a { color: #38BDF8; text-decoration: none; font-weight: 500; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">● PhishGuard API Gateway Online</span>
              <h1>PhishGuard AI Engine</h1>
              <p>Node.js & Express REST Backend is running on port ${PORT}.</p>
              <p>To access the modern React UI, start the Vite development server in the <code>client/</code> directory via <code>npm run dev</code> or open <a href="http://localhost:5173" target="_blank">http://localhost:5173</a>.</p>
            </div>
          </body>
        </html>
      `);
    }
  });
});

// Centralized error handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🛡️  PHISHGUARD AI BACKEND RUNNING ON PORT: ${PORT}`);
  console.log(`🔗  API Status: http://localhost:${PORT}/api`);
  console.log(`🔍  Health Check: http://localhost:${PORT}/api/system/health`);
  console.log(`======================================================\n`);
});

module.exports = app;
