const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const models = require("../db/models");
const UserEntity = require("../entities/User.entity");
const ItemEntity = require("../entities/Item.entity");

function checkPassword(password, hash){
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex"));
    });
  });
}

function saltPassword(password){
  return new Promise((resolve, reject) => {
    // generate random 16 bytes long salt
    const salt = crypto.randomBytes(32).toString("hex");

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

exports.getUser = async function (query) {
  const User = models.getModel("User");
  const user = await User.findOne(query);
  return new UserEntity(user);
};

exports.usernameIsFree = async function (name) {
  const User = models.getModel("User");
  const users = await User.find({name});
  return users.length === 0;
};

exports.doLogin = async function ({username, password}) {
  const User = models.getModel("User");
  const user = await User.findOne({name: username});
  
  if(user){
    const pwOk = await checkPassword(password, user.password);
    if(pwOk){
      const User = models.getModel("User");
      const token = jwt.sign({ _id: user._id, name: user.name }, "shhhhh");
      const loggedInUser = await User.update({_id: user._id}, {
        jwt: token
      });
      return new UserEntity(loggedInUser);
    }
  }

  return {success: false, error: "login_failed"};
};

exports.doSignup = async function ({username, password}) {
  const User = models.getModel("User");
  const user = await User.findOne({name: username});
  const newUserDefaults = {
    x: 0,
    y: 0,
    health: 100,
    strength: 10,
    description: "A young n00b. Weak and pathetic."
  };
  
  if(user){
    return {success: false, error: "user_exists"};
  }
  const salted = await saltPassword(password);
  const newUser = await new User({name:username, password: salted, ...newUserDefaults}).save();
  const token = jwt.sign({ _id: newUser._id, name: newUser.name }, "shhhhh");
  newUser.jwt = token;
  await newUser.save();
  return newUser;
};

exports.doLogout = async function ({username}) {
  const User = models.getModel("User");
  const user = await User.findOne({name: username});

  if(user){
    await User.update({_id: user._id}, {
      jwt: null
    });
    return {
      success: true
    };
  }

  return {success: false};
};

exports.getPlayersInRadius = async function (x, y, radius = 1) {
  const User = models.getModel("User");
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
  const User = models.getModel("User");
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