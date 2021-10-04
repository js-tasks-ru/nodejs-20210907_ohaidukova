export const handleIdErrors = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.code ? err.code : 500;
    ctx.body = err.message;
  }
};
