import { KoaPassport } from 'koa-passport';
const passport = new KoaPassport();

import localStrategy from './strategies/local';
import facebookStrategy from './strategies/facebook';
import vkontakteStrategy from './strategies/vkontakte';
import githubStrategy from './strategies/github';

passport.use(localStrategy);
passport.use(facebookStrategy);
passport.use(vkontakteStrategy);
passport.use(githubStrategy);

export default passport;
