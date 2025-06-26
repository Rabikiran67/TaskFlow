require('dotenv').config();
const express = require('express');
const cors = require('cors'); // We will configure this
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    // --- NEW, MORE EXPLICIT CORS CONFIGURATION ---
    const allowedOrigins = [
      'http://localhost:5173', // Your local frontend
      'https://task-flow-nine-inky.vercel.app' // Your deployed frontend
    ];

    const corsOptions = {
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true, // This allows session cookies to be sent back and forth
    };

    // Use the configured options
    app.use(cors(corsOptions));
    // --- END OF NEW CONFIGURATION ---

    app.use(express.json());
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    require('./config/passport')(passport);

    app.use('/api/users', require('./routes/users'));
    app.use('/api/tasks', require('./routes/tasks'));

    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
    });

    process.on('unhandledRejection', (err, promise) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error("❌ FATAL ERROR: Could not connect to the database. Server is not starting.");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();