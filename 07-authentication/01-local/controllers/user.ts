import User from '../models/User';

export const userByEmail = async function userByEmail(email) {
  const users = await User.find({ email: email });
  return users[0];
};
