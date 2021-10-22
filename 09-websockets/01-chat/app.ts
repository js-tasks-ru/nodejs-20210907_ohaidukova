import path from 'path';
import Koa, { DefaultState } from 'koa';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import Router from 'koa-router';
import handleMongooseValidationError from './libs/validationErrors';
import mustBeAuthenticated from './libs/mustBeAuthenticated';
import { recommendationsList } from './controllers/recommendations';
import {
  productsBySubcategory,
  productsByQuery,
  productList,
  productById,
} from './controllers/products';
import { categoryList } from './controllers/categories';
import { login } from './controllers/login';
import { oauth, oauthCallback } from './controllers/oauth';
import { me } from './controllers/me';
import { register, confirm } from './controllers/registration';
import { checkout, getOrdersList } from './controllers/orders';
import { messageList } from './controllers/messages';
import Session from './models/Session';
import { IUserDocument } from './models/User';

interface IContext {
  user: IUserDocument;
  login: (user: IUserDocument) => Promise<string>;
  token: string;
}

const app = new Koa<DefaultState, IContext>();

app.use(require('koa-bodyparser')());
app.use(require('koa-static')(path.join(__dirname, 'public')));

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
    const token = uuid();
    await Session.create({ token, user, lastVisit: new Date() });

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

  const session = await Session.findOne({ token }).populate('user');
  if (!session) {
    ctx.throw(401, 'Неверный аутентификационный токен');
  }
  session.lastVisit = new Date();
  await session.save();

  ctx.user = session.user as IUserDocument;
  return next();
});

router.get('/recommendations', recommendationsList);
router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productsByQuery, productList);
router.get('/products/:id', productById);

router.post('/login', login);

router.get('/oauth/:provider', oauth);
router.post('/oauth_callback', handleMongooseValidationError, oauthCallback);

router.get('/me', mustBeAuthenticated, me);

router.post('/register', handleMongooseValidationError, register);
router.post('/confirm', confirm);

router.get('/orders', mustBeAuthenticated, getOrdersList);
router.post(
  '/orders',
  mustBeAuthenticated,
  handleMongooseValidationError,
  checkout
);

router.get('/messages', mustBeAuthenticated, messageList);

app.use(router.routes());

// this for HTML5 history in browser
const index = fs.readFileSync(path.join(__dirname, 'public/index.html'));
app.use(async (ctx, next) => {
  if (!ctx.url.startsWith('/api')) {
    ctx.set('content-type', 'text/html');
    ctx.body = index;
  }
});

export default app;
