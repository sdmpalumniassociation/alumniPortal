require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:4000', 'https://www.sdmpalumniassociation.in', 'https://alumni-portal-admin-lake.vercel.app', 'http://localhost:3001', 'http://localhost:4001', 'https://admin.sdmpalumniassociation.in', 'https://sdmpalumniassociation.in'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Apply CORS with options
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from uploads directory
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ranjithchandran220:goZIerWoJAn93Rpt@cluster0.06c3v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

const PORT = process.env.PORT || 5001;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// For Vercel
module.exports = app; 
