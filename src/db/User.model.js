const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  x:{
    type: Number,
    required: true,
  },
  y:{
    type: Number,
    required: true,
  },
  holding:{ 
    type: mongoose.ObjectId, 
    ref: "Item"
    // populate valid items here
  },
  inventory:{ 
    type: mongoose.ObjectId, 
    ref: "Item", 
    many: true 
    // populate valid items here
  },
  health:{
    type: Number,
    required: true,
  },
  strength:{
    type: Number,
    required: true
  },
  isResponsive: {
    type: Boolean,
    default: false,
  },
});