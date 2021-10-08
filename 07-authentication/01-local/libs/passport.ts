import { KoaPassport } from 'koa-passport';
const passport = new KoaPassport();

import localStrategy from './strategies/local';

passport.use(localStrategy);

export default passport;
