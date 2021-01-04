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
  },
  jwt: {
    type: String,
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
    ref: "Item", 
    // populate valid items here
  },
  inventory:{ 
    type: [{ type : mongoose.ObjectId, ref: "Item" }], 
    // populate valid items here
  },
  health:{
    type: Number,
    required: true,
    default: 10
  },
  strength:{
    type: Number,
    required: true,
    default: 10
  },
  status: {
    type: String,
    default: "inactive",
    enum: ["active", "inactive", "banned"]
  },
},
{ 
  timestamps: true 
});