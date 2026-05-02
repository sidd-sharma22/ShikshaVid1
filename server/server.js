const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Debug: Log which env vars are available (names only, not values for security)
console.log('🔍 Environment variables available:', Object.keys(process.env).filter(k =>
  ['MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRE', 'CLIENT_URL', 'PORT'].includes(k)
));
console.log('🔍 MONGODB_URI defined?', !!process.env.MONGODB_URI);

connectDB();

const app = express();

// CORS - handle with and without trailing slash
const allowedOrigin = (process.env.CLIENT_URL || 'https://shiksha-vid.vercel.app').replace(/\/+$/, '');
app.use(cors({
  origin: [allowedOrigin, `${allowedOrigin}/`],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShikshaVid API is running' });
});

// 404 catch-all (must be before error handler)
app.use((req, res, _next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler (Express 5 compatible — must have 4 args)
app.use((err, req, res, _next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ShikshaVid Server running on port ${PORT}`);
});
