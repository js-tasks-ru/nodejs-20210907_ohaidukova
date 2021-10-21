import { Server } from 'socket.io';

import Session from './models/Session';
import Message from './models/Message';
import { IUserDocument } from './models/User';

declare module 'socket.io' {
  interface Socket {
    user: IUserDocument;
  }
}

function socket(server) {
  const io = new Server(server);

  io.use(async (socket, next) => {
    const token = socket.handshake.query.token as string;

    if (!token) {
      return next(new Error('anonymous sessions are not allowed'));
    }
    const session = await Session.findOne({ token }).populate('user');
    if (!session) {
      return next(new Error('wrong or expired session token'));
    }

    socket.user = session.user as IUserDocument;
    next();
  });

  io.on('connection', (socket) => {
    socket.on('message', async (msg) => {
      const { id: chat, displayName: user } = socket.user;

      await Message.create({ date: new Date(), text: msg, chat, user });
    });
  });

  return io;
}

export default socket;
