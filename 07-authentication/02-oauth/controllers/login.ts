import { v4 as uuid } from 'uuid';
import passport from '../libs/passport';

export const login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = { error: info };
      return;
    }

    const token = uuid();

    ctx.body = { token };
  })(ctx, next);
};
