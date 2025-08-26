const cors = require('cors');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:5173', 'http://localhost:4173'] // Add your production domains here
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = cors(corsOptions);