const mongoose = require("mongoose");
const db = mongoose.connection;
const models = require("./models");

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("[MongoDB] Connected");
  models.loadModels(db);
});

exports.connect = ({dbUrl, options})=>{
  return mongoose.connect(dbUrl, options);
};