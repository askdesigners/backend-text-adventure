const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  start: {
    type: String,
    required: true,
    index: true,
  },
  end: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: mongoose.ObjectId, 
    ref: "User", 
  }
},
{ 
  timestamps: true 
});