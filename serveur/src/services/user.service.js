import User from "../models/user.model.js";
import { BadRequestError } from "../errors/index.js";

const create = async (userData) => {
  const { pseudo, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new BadRequestError("Email déja utilisé");

  const user = new User({ pseudo, email, password });
  await user.save();
  return user;
};

const get = (options) => {
  return User.findOne(options);
};

const getUserById = async (userId) => {
  return await User.findById(userId);
};

const updateUser = async (userId, data) => {
  return await User.findByIdAndUpdate(userId, data, { new: true });
};

export { create, get, getUserById, updateUser };
