const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const noteRoutes = require('./routes/noteRoutes');

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-twitter')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use(cors());
app.use(express.json());
 
app.use('/', noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
