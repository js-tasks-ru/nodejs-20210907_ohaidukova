import passport from '../libs/passport';
import config from '../config';
import { v4 as uuid } from 'uuid';

export const oauth = async function oauth(ctx, next) {
  const provider = ctx.params.provider;

  await passport.authenticate(provider, config.providers[provider].options)(
    ctx,
    next
  );

  ctx.status = 200;
  ctx.body = { status: 'ok', location: ctx.response.get('location') };
  ctx.response.remove('location');
};

export const oauthCallback = async function oauthCallback(ctx, next) {
  const provider = ctx.request.body.provider;

  await passport.authenticate(provider, async (err, user, info) => {
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
