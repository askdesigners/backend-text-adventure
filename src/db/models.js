const User = require("./User.model.js");
const Item = require("./Item.model.js");
const Move = require("./Move.model.js");

let models;

exports.getModel = (modelName)=>models[modelName];

exports.loadModels = (connection)=>{
  models = {
    User: connection.model("User", User),
    Item: connection.model("Item", Item),
    Move: connection.model("Move", Move),
  };

  // ONLY works on replica sets
  // models.User.watch().on("User change", data => {
  //   console.log("[MODEL CHANGE OP]",{
  //     operationType: data.operationType,
  //     documentKey: data.documentKey
  //   });
  // });

  // models.Item.watch().on("Item change", data => {
  //   console.log("[MODEL CHANGE OP]",{
  //     operationType: data.operationType,
  //     documentKey: data.documentKey
  //   });
  // });
};