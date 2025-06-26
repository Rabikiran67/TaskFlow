require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

// We will require files at the top to see if any of them crash immediately
console.log("--- Starting Server File ---");
console.log("Loading module: ./config/db");
const connectDB = require('./config/db');

console.log("Loading module: ./middleware/errorHandler");
const errorHandler = require('./middleware/errorHandler');

console.log("Loading module: ./config/passport");
const passportConfig = require('./config/passport');

console.log("Loading module: ./routes/users");
const usersRoutes = require('./routes/users');

console.log("Loading module: ./routes/tasks");
const tasksRoutes = require('./routes/tasks');
console.log("--- All modules loaded successfully ---");

const startServer = async () => {
  try {
    await connectDB();
    const app = express();

    // CORS, express.json, etc.
    const corsOptions = {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    };
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    app.use(express.json());
    
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Initialize passport config
    passportConfig(passport);

    // Use the pre-loaded routes
    console.log("Initializing /api/users routes...");
    app.use('/api/users', usersRoutes);
    console.log("Initializing /api/tasks routes...");
    app.use('/api/tasks', tasksRoutes);
    console.log("--- All routes initialized successfully ---");

    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`✅ Server started successfully on port ${PORT}`);
    });

    process.on('unhandledRejection', (err, promise) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error("❌ FATAL ERROR in startServer block.");
    console.error(error);
    process.exit(1);
  }
};

startServer();