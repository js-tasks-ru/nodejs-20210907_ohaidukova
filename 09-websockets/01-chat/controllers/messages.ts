import Message from '../models/Message';
import mapMessage from '../mappers/message';

export const messageList = async function messages(ctx, next) {
  const messages = await Message.find({ user: ctx.user.displayName }).limit(20);
  ctx.body = { messages: messages.map(mapMessage) };
};
