const User = require("./User.model.js");
const Item = require("./Item.model.js");

let models;

exports.getModel = (modelName)=>models[modelName];

exports.loadModels = (connection)=>{
  models = {
    User: connection.model("User", User),
    Item: connection.model("Item", Item),
  };
};