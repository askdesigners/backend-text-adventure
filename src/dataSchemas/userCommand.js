const Joi = require("joi");
const Validator = require("./Validator");

const schema = Joi.object({
  command: Joi.string().required(),
});

module.exports = new Validator("userCommand", schema);