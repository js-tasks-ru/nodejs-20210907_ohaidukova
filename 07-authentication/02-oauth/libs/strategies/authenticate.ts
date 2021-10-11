import User from '../../models/User';

export default async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email: email,
        displayName: displayName ? displayName : email.split('@')[0],
      });

      await user.save();
    }

    return done(null, user);
  } catch (err) {
    done(err);
  }
}
