const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  'https://main.dsqo2q3l6bl5h.amplifyapp.com/',
   'https://main.dsqo2q3l6bl5h.amplifyapp.com/',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};


app.use(cors(corsOptions));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Smart Patient Onboarding API is running...');
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));

app.use('/api/verification', require('./routes/verificationRoutes'));


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));