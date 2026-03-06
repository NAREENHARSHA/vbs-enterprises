require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Remove ngrok warning
app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', '1');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Serve frontend — works both locally and on Render ──────────
const frontendPath = path.join(__dirname, '..', 'frontend', 'public');
app.use(express.static(frontendPath));

// API routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));

// Frontend pages — send index.html for all non-API routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendPath, 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Connect MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected successfully');
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🚀  VBS Enterprises is LIVE!');
      console.log(`    Shop  →  https://your-app.onrender.com`);
      console.log(`    Admin →  https://your-app.onrender.com/admin`);
      console.log('');
    });
  })
  .catch(err => {
    console.error('❌  MongoDB error:', err.message);
    process.exit(1);
  });
