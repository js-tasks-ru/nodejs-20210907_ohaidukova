import passportFacebook from 'passport-facebook';
import config from '../../config';
import get from 'lodash/get';
import authenticate from './authenticate';

const FacebookStrategy = passportFacebook.Strategy;

export default new FacebookStrategy(
  {
    clientID: config.providers.facebook.app_id,
    clientSecret: config.providers.facebook.app_secret,
    callbackURL: config.providers.facebook.callback_uri,
    profileFields: ['displayName', 'email'],
    // session: false,
  },
  function (accessToken, refreshToken, profile, done) {
    authenticate(
      'facebook',
      get(profile, 'emails[0].value'),
      profile.displayName,
      done
    );
  }
);
