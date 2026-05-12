const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const messagesRouter = require('./routes/messages');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/messages', messagesRouter);

// Serve Static Files for Production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log('MongoDB connected');
  app.listen(PORT, ()=> console.log('Server running on port', PORT));
})
.catch(err=>{ console.error('DB connect error', err); process.exit(1); });