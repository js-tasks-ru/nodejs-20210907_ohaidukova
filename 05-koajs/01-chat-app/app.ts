import path from 'path';
import Koa from 'koa';
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const clients = [];

router.get('/subscribe', async (ctx, next) => {
  const promise: Promise<string> = new Promise((resolve) => {
    clients.push(resolve);
  });

  let msg: string;

  try {
    msg = await promise;
  } catch (err) {
    console.log(err);
  }

  ctx.body = msg;
});

router.post('/publish', async (ctx, next) => {
  const msg = ctx.request.body.message;

  if (!msg) throw new Error('No empty message');

  clients.forEach((resolve) => resolve(msg));

  clients.length = 0;
  ctx.status = 200;
  ctx.body = 'ok';
});

app.use(router.routes());

export default app;
