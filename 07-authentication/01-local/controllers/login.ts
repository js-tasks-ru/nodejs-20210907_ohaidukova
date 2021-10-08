import Koa from 'koa';
import { v4 as uuid } from 'uuid';
import passport from '../libs/passport';

const login = async function login(ctx: Koa.Context, next: Koa.Next) {
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

export default login;
