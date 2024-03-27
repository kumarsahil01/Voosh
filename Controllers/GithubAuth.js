const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../Models/User');
require("dotenv").config();
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/api/auth/github/callback"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        const username = profile.username;
        const password = Math.random().toString(36).slice(-8);
        user = new User({
          githubId: profile.id,
          email: profile.emails[0].value,
          username: username,
          password: password,
          isPublic: true,
          role: 'user'
        });
        await user.save();
      }
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

module.exports = passport