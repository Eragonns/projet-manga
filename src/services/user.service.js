import User from "../models/user.model.js";

const create = (data) => {
  return User.create(data);
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
