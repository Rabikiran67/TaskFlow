require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const startServer = async () => {
  try {
    await connectDB();
    const app = express();

    // --- NEW, SIMPLER, AND MORE ROBUST CORS CONFIGURATION ---
    const corsOptions = {
      // This explicitly tells the server to allow requests ONLY from your deployed frontend.
      origin: 'https://task-flow-nine-inky.vercel.app',
      credentials: true, // This is important for auth-related headers
    };
    app.use(cors(corsOptions));
    // --- END OF NEW CONFIGURATION ---

    // This piece is crucial for handling "preflight" requests that browsers send for CORS
    app.options('*', cors(corsOptions)); 

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
    const server = app.listen(PORT, () => console.log(`Server running successfully on port ${PORT}`));

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