import LocalStrategy from 'passport-local';
import { userByEmail } from '../../controllers/user';
import User from '../../models/User';

export default new LocalStrategy(
  { usernameField: 'email', session: false },
  async function (email, password, done) {
    try {
      const user = await userByEmail(email);
      if (!user) {
        done(null, false, 'Нет такого пользователя');
        return;
      }

      const isPasswordCorrect = await new User(user).checkPassword(password);
      isPasswordCorrect
        ? done(null, user)
        : done(null, false, 'Неверный пароль');
    } catch (err) {
      done(err);
    }
  }
);
