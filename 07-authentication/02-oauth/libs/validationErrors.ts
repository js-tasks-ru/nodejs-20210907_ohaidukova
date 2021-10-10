import Koa from 'koa';

export default async function handleMongooseValidationError(
  ctx: Koa.Context,
  next: Koa.Next
) {
  try {
    await next();
  } catch (err) {
    if (err.name !== 'ValidationError') throw err;

    ctx.status = 400;

    const errors = {};

    for (const field of Object.keys(err.errors)) {
      errors[field] = err.errors[field].message;
    }

    ctx.body = {
      errors: errors,
    };
  }
}
