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
    console.error("❌ FATAL ERROR: Could not start server.");
    console.error(error);
    process.exit(1);
  }
};

startServer();