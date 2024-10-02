import User from "./model.user.js";

const create = (data) => {
  return User(data).save();
};

const get = (options) => {
  return User.findOne(options);
};

export { create, get };
