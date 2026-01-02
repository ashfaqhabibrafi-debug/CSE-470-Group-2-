const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/disasters', require('./routes/disasterRoutes'));
app.use('/api/help-requests', require('./routes/helpRequestRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/donation-events', require('./routes/donationEventRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/organizations', require('./routes/organizationRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Disaster Management System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

