import User from '../models/User';
import connection from '../libs/connection';
import users from '../../../data/users.json';

(async () => {
  await User.deleteMany();

  for (const user of users.users) {
    const u = new User(user);
    await u.setPassword(user.password);
    await u.save();
  }

  connection.close();
  console.log(`All done, ${users.users.length} users have been saved in DB`);
})();
