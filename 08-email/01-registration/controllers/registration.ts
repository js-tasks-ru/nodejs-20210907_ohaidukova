import { v4 as uuid } from 'uuid';
import User from '../models/User';
import { sendMail, IMailOptions } from '../libs/sendMail';

export const register = async (ctx, next) => {
  const verificationToken = uuid();
  const { email, password, displayName } = ctx.request.body;

  const user = new User({
    email,
    displayName,
    verificationToken,
  });

  await user.setPassword(password);
  await user.save();

  const options: IMailOptions = {
    template: 'confirmation',
    locals: { token: verificationToken },
    to: email,
    subject: 'Подтвердите почту',
  };

  await sendMail(options);

  ctx.body = { status: 'ok' };
};

export const confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  // const { verificationToken } = ctx.params;

  const users = await User.find({ verificationToken });
  const user = users[0];

  if (!user) {
    ctx.status = 400;
    ctx.body = { error: 'Ссылка подтверждения недействительна или устарела' };
    return;
  }

  delete user.verificationToken;

  await User.updateOne(
    { verificationToken },
    { $unset: { verificationToken: '' } }
  );

  const token = await ctx.login(user._id);

  ctx.body = { token };
};
