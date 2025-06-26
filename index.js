require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const passport = require('passport');

// --- Main Server Startup Function ---
const startServer = async () => {
  try {
    // 1. Await the database connection
    await connectDB();

    const app = express();

    // Session & Passport Middleware (must be before routes)
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Passport config (pass passport object to the config function)
    require('./config/passport')(passport);

    // Core Middleware
    app.use(cors());
    app.use(express.json());

    // API Routes
    app.use('/api/users', require('./routes/users'));
    app.use('/api/tasks', require('./routes/tasks'));

    // Error Handling Middleware (must be last)
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    
    // 2. Start the Express server
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error("Could not start server due to database connection failure.");
    process.exit(1);
  }
};

// --- Execute the startup function ---
startServer();