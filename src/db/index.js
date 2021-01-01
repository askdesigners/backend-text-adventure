const mongoose = require("mongoose");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("[MongoDB] Connected");
});

exports.connect = ({dbUrl, options})=>{
  mongoose.connect(dbUrl, options);
};