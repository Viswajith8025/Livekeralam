const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Route files
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const errorHandler = require('./middlewares/error');

const app = express();

// Root route for Render/Production health check
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'LiveKeralam API is live',
    version: '1.0.0',
    endpoints: {
      events: '/api/v1/events',
      places: '/api/v1/places',
      auth: '/api/v1/auth'
    }
  });
});

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'https://eventkeralamm.vercel.app', 'http://localhost:5173'].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount routers
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/places', placeRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'EventKerala API is running' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
