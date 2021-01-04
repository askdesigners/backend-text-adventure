const models = require("../../db/models");
const User = models.getModel("User");
const UserEntity =require("../../entities/User.entity");

exports.addUser = async function (user) {
  const newUser = new User(user).save();
  return new UserEntity(newUser);
};

exports.getUser = async function (query) {
  const user = await User.findOne(query);
  return new UserEntity(user);
};