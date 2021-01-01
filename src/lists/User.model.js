const { Text, Checkbox, Password, Integer, Relationship } = require("@keystonejs/fields");

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
    password: {
      type: Password,
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
    holding:{ type: Relationship, ref: "Item"},
    inventory:{ type: Relationship, ref: "Item", many: true },
    health:{
      type: Integer,
      isRequired: true,
    },
    strength:{
      type: Integer,
      isRequired: true
    },
    isResponsive: {
      type: Checkbox,
      defaultValue: false,
    },
  },
};