const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  x:{
    type: Number,
    required: true,
    index: true,
  },
  y:{
    type: Number,
    required: true,
    index: true,
  },
  valid: {
    type: Boolean,
    index: true,
  },
  user: {
    type: mongoose.ObjectId, 
    ref: "User", 
    index: true,
  },
  command: {
    type: String
  }
},
{ 
  timestamps: true 
});