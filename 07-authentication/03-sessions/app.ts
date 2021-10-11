import path from 'path';
import Koa, { DefaultState } from 'koa';
import Router from 'koa-router';
import Session from './models/Session';
import { v4 as uuid } from 'uuid';
import handleMongooseValidationError from './libs/validationErrors';
import mustBeAuthenticated from './libs/mustBeAuthenticated';
import { login } from './controllers/login';
import { oauth, oauthCallback } from './controllers/oauth';
import { me } from './controllers/me';
import { IUserDocument } from './models/User';
import jwt from 'jsonwebtoken';
import config from './config';

interface IContext {
  user: IUserDocument;
  login: (user: IUserDocument) => Promise<string>;
  token: string;
}

const app = new Koa<DefaultState, IContext>();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = { error: err.message };
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
});

app.use((ctx, next) => {
  ctx.login = async function (user) {
    // const token = uuid();
    const token = jwt.sign(
      {
        user: user.id,
      },
      config.jwt
    );

    await Session.create({
      token: token,
      lastVisit: new Date(),
      user: user.id,
    });

    return token;
  };

  return next();
});

const router = new Router<any, IContext>({ prefix: '/api' });

router.use(async (ctx, next) => {
  const header = ctx.request.get('Authorization');
  if (!header) return next();

  const token = header.split(' ')[1];
  if (!token) return next();

  try {
    const session = await Session.findOne({ token }).populate('user');
    session.lastVisit = new Date();

    await Session.updateOne({ token: session.token }, session);
    ctx.user = session.user as IUserDocument;

    return next();
  } catch {
    ctx.status = 401;
    ctx.body = { error: 'Неверный аутентификационный токен' };
  }
});

router.post('/login', login);

router.get('/oauth/:provider', oauth);
router.post('/oauth_callback', handleMongooseValidationError, oauthCallback);

router.get('/me', mustBeAuthenticated, me);

app.use(router.routes());

// this for HTML5 history in browser
const fs = require('fs');

const index = fs.readFileSync(path.join(__dirname, 'public/index.html'));
app.use(async (ctx) => {
  if (ctx.url.startsWith('/api') || ctx.method !== 'GET') return;

  ctx.set('content-type', 'text/html');
  ctx.body = index;
});

export default app;
