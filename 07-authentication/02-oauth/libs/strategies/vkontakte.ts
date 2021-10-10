import passportVkontakte from 'passport-vkontakte';
import config from '../../config';
import authenticate from './authenticate';

const VkontakteStrategy = passportVkontakte.Strategy;

export default new VkontakteStrategy(
  {
    clientID: config.providers.vkontakte.app_id,
    clientSecret: config.providers.vkontakte.app_secret,
    callbackURL: config.providers.vkontakte.callback_uri,
    apiVersion: '5.110',
  },
  function (accessToken, refreshToken, params, profile, done) {
    authenticate(
      'vkontakte',
      profile.emails[0].value,
      profile.displayName,
      done
    );
  }
);
