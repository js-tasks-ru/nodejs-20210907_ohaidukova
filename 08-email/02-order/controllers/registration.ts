import { v4 as uuid } from 'uuid';
import User from '../models/User';
import { sendMail, IMailOptions } from '../libs/sendMail';

export const register = async (ctx, next) => {
  const verificationToken = uuid();
  const user = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken,
  });

  await user.setPassword(ctx.request.body.password);
  await user.save();

  const options: IMailOptions = {
    template: 'confirmation',
    locals: { token: verificationToken },
    to: user.email,
    subject: 'Подтвердите почту',
  };

  await sendMail(options);

  ctx.body = { status: 'ok' };
};

export const confirm = async (ctx, next) => {
  const user = await User.findOne({
    verificationToken: ctx.request.body.verificationToken,
  });

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }

  user.verificationToken = undefined;
  await user.save();

  const token = uuid();

  ctx.body = { token };
};
