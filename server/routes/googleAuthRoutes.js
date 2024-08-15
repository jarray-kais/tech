import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';

const googleAuthRoutes = express.Router();
dotenv.config()
// Configuration de la stratégie d'authentification Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CELINT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Vérifier si l'utilisateur existe dans la base de données
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // Créer un nouvel utilisateur s'il n'existe pas
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture : profile._json.image.url
          
        });
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Route d'authentification Google
googleAuthRoutes.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback après l'authentification avec Google
googleAuthRoutes.get('/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Rediriger l'utilisateur après l'authentification réussie
    res.redirect('/');
  }
);

export default googleAuthRoutes;