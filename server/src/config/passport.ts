import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User';

console.log('GitHub Client ID loaded:', process.env.GITHUB_CLIENT_ID);

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'dummy_client_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy_client_secret',
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback'
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          profileUrl: profile.profileUrl,
          avatarUrl: profile._json.avatar_url
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

export default passport;
