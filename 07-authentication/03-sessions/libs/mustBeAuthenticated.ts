export default function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401;
    ctx.body = { error: 'Пользователь не залогинен' };
  } else return next();
}
