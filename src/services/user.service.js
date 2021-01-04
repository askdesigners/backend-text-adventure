const models = require("../../db/models");
const User = models.getModel("User");
const UserEntity =require("../../entities/User.entity");
const ItemEntity =require("../../entities/Item.entity");

exports.addUser = async function (user) {
  const newUser = new User(user).save();
  return new UserEntity(newUser);
};

exports.getUser = async function (query) {
  const user = await User.findOne(query);
  return new UserEntity(user);
};

exports.getPlayersInRadius = async function (x, y, radius = 1) {
  const users = await User.find({
    x: {
      $gte: x - radius,
      $lte: x + radius,
    },
    y: {
      $gte: y - radius,
      $lte: y + radius,
    }
  });

  return users.map(new UserEntity);
};

exports.getUserItems = async function(user){
  const items = await User.find({
    _id: user._id
  })
    .populate("holding")
    .populate("inventory")
    .select({
      holding: 1,
      inventory: 1
    });
  
  const inventory = items.inventory.map(new ItemEntity);
  const holding = new ItemEntity(items.holding);
  return [holding, ...inventory];  
};