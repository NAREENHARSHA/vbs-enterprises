require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());


app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', '1');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));

const FE = path.join(__dirname, '../frontend/public');
app.get('/',       (req, res) => res.sendFile(path.join(FE, 'index.html')));
app.get('/admin',  (req, res) => res.sendFile(path.join(FE, 'admin.html')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 VBS Enterprises is LIVE!`);
      console.log(`   Shop  ➜  http://localhost:${PORT}`);
      console.log(`   Admin ➜  http://localhost:${PORT}/admin\n`);
      console.log(`💡 To share with customers on same WiFi:`);
      console.log(`   Run: ipconfig  →  find IPv4 Address`);
      console.log(`   Share: http://YOUR_IP:${PORT}\n`);
    });
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
