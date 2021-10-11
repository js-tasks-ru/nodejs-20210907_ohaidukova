import passportLocal from 'passport-local';
import User from '../../models/User';

const LocalStrategy = passportLocal.Strategy;

export default new LocalStrategy(
  { usernameField: 'email', session: false },
  async function (email, password, done) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, 'Нет такого пользователя');
      }

      const isValidPassword = await user.checkPassword(password);

      if (!isValidPassword) {
        return done(null, false, 'Неверный пароль');
      }

      return done(null, user);
    } catch (err) {
      done(err);
    }
  }
);
