const { Text, Checkbox, Integer, Relationship } = require("@keystonejs/fields");

module.exports ={
  fields: {
    name: {
      type: Text,
      isRequired: true,
    },
    description: {
      type: Text,
      isRequired: true,
    },
    canHold:{
      type: Checkbox,
      defaultValue: false,
    },
    heldBy:{ type: Relationship, ref: "User"},
    canOpen: {
      type: Checkbox,
      defaultValue: false,
    },
    isLocked: {
      type: Checkbox,
      defaultValue: false,
    },
    useCount: {
      type: Integer,
      isRequired: true,
    },
    useLimit:{
      type: Integer,
      isRequired: true,
    },
    x:{
      type: Integer,
      isRequired: true,
    },
    y:{
      type: Integer,
      isRequired: true,
    },
  },
};