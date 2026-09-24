const express = require('express');
const mongoose = require('mongoose');
const noticeRoutes = require('./routes/noticeRoutes');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route - check karne ke liye ki server chal raha hai
app.get('/', (req, res) => {
  res.send('CampusConnect API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notices', noticeRoutes);
// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});