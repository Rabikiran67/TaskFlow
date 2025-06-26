const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/users/auth/google/callback', // This path matches our backend route
      },
      async (accessToken, refreshToken, profile, done) => {
        // This function runs after Google successfully authenticates the user
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        try {
          // Check if a user with this Google ID already exists
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // If they exist, continue
            return done(null, user);
          } else {
            // If not, check if a user with that email exists (local account)
            user = await User.findOne({ email: newUser.email });
            if (user) {
              // For security, we won't automatically link accounts.
              // We'll return an error telling them to log in with their password.
              // A more advanced implementation might ask them to log in and then link accounts.
              return done(new Error('This email is already registered. Please log in with your password to link your account.'), false);
            }
            // If no user exists at all, create a new one
            user = await User.create(newUser);
            return done(null, user);
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  // Used to store the user's ID in the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Used to retrieve the user's data from the session using the ID
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};