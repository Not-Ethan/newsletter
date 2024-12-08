const passport = require('passport');
const magicLoginStrategy = require('./MagicLink');

// Register the custom magic login strategy
passport.use('magiclink', magicLoginStrategy);

// Serialize and deserialize users for session management
passport.serializeUser((user, done) => {
    done(null, user.id); // Store id in session
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
