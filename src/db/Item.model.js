const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  instance: {
    type: String,
    enum: ["Apple"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  canHold:{
    type: Boolean,
    defaultValue: false,
  },
  heldBy:{ 
    type: mongoose.ObjectId, 
    ref: "User"
  },
  canOpen: {
    type: Boolean,
    defaultValue: false,
  },
  isLocked: {
    type: Boolean,
    defaultValue: false,
  },
  useCount: {
    type: Number,
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
},
{ 
  timestamps: { 
    createdAt: "created_at" 
  } 
});