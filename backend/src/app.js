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
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');


const { nosqlSanitizer, xssSanitizer } = require('./middlewares/security');
const { apiLimiter, authLimiter } = require('./middlewares/rateLimit');

const errorHandler = require('./middlewares/error');

const app = express();

// Trust proxy for Render/Vercel rate limiting
app.set('trust proxy', 1);

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
  origin: [
    process.env.FRONTEND_URL, 
    'https://eventkeralamm.vercel.app', 
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Data sanitization
app.use(nosqlSanitizer);
app.use(xssSanitizer);

// Apply rate limiting
app.use('/api', apiLimiter);
app.use('/api/v1/auth', authLimiter);

// Static folder
app.use(express.static(path.join(__dirname, '../public')));

// Mount routers
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/places', placeRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/user', userRoutes);


// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'LiveKeralam API is running' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
