import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const googleLogin = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you would handle saving user info into a database
    return done(null, profile);
  }));

  // Serialize user info into session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user info from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default googleLogin;
