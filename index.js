// 1. LOAD ENVIRONMENT VARIABLES
// Must be the very first line to ensure all other modules have access to the .env variables
require('dotenv').config();

// 2. IMPORT DEPENDENCIES
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// --- Main Server Startup Function ---
// We wrap our entire startup logic in an async function to use 'await'.
const startServer = async () => {
  try {
    // 3. AWAIT DATABASE CONNECTION
    // The script will pause here and wait for connectDB() to either succeed or fail.
    // This prevents the server from starting if the database isn't ready.
    await connectDB();

    // 4. INITIALIZE EXPRESS APP (only after DB is connected)
    const app = express();

    // 5. SETUP MIDDLEWARE
    // Enable Cross-Origin Resource Sharing for all routes
    app.use(cors());

    // Enable Express to parse JSON formatted request bodies
    app.use(express.json());

    // Session & Passport Middleware (required for OAuth)
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      // In production, you would add a `cookie` object here with `secure: true` for HTTPS
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Passport config (pass the configured passport object)
    require('./config/passport')(passport);


    // 6. DEFINE API ROUTES
    app.use('/api/users', require('./routes/users'));
    app.use('/api/tasks', require('./routes/tasks'));


    // 7. SETUP ERROR HANDLING MIDDLEWARE
    // This must be the LAST piece of middleware added to the stack.
    app.use(errorHandler);


    // 8. DEFINE PORT AND START SERVER
    // Render will provide its own port via process.env.PORT. We fall back to 5000 for local development.
    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
    });

    // Optional: Gracefully handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

  } catch (error) {
    // This block will run if the `await connectDB()` call fails
    console.error("❌ FATAL ERROR: Could not connect to the database. Server is not starting.");
    console.error(error); // Log the detailed error from mongoose
    process.exit(1); // Exit the process with an error code
  }
};

// --- 9. EXECUTE THE STARTUP FUNCTION ---
startServer();