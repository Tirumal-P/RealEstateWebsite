require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(helmet()); // Set security-related HTTP headers
app.use(morgan('dev')); // Log HTTP requests
app.use(express.json()); // Parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
// app.use('/api/owners', require('./routes/ownerRoutes'));
// app.use('/api/customers', require('./routes/customerRoutes'));
// app.use('/api/realtors', require('./routes/realtorRoutes'));
// app.use('/api/applications', require('./routes/applicationRoutes'));
// app.use('/api/contracts', require('./routes/contractRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));
app.use('/api/customer',require('./routes/customerRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));