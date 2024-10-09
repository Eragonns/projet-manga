import User from "../models/user.model.js";

const create = (data) => {
  return User.create(data);
};

const get = (options) => {
  return User.findOne(options);
};

export { create, get };
