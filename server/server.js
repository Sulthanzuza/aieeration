require('dotenv').config();
const express = require('express');
const corsConfig = require('./middleware/corsConfig');
const errorHandler = require('./middleware/errorHandler');
const audioRoutes = require('./routes/audioRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(corsConfig);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/audio', audioRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Audio Analysis API Server',
    version: '1.0.0',
    endpoints: {
      'POST /api/audio/analyze': 'Analyze audio file',
      'GET /api/audio/health': 'Health check'
    }
  });
});


app.use(errorHandler);

// Start server
app.listen(PORT, () => {

  

  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  Warning: GEMINI_API_KEY environment variable not set');
  }
});

module.exports = app;