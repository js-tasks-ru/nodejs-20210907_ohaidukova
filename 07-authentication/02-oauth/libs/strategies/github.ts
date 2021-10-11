import passportGithub from 'passport-github';
import config from '../../config';
import get from 'lodash/get';
import authenticate from './authenticate';

const GithubStrategy = passportGithub.Strategy;

export default new GithubStrategy(
  {
    clientID: config.providers.github.app_id,
    clientSecret: config.providers.github.app_secret,
    callbackURL: config.providers.github.callback_uri,
    scope: ['user:email'],
    // session: false,
  },
  function (accessToken, refreshToken, profile, done) {
    console.log('git profile', profile);
    authenticate(
      'github',
      get(profile, 'emails[0].value'),
      profile.username,
      done
    );
  }
);
