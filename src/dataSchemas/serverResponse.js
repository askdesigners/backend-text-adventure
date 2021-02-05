const Joi = require("joi");
const Validator = require("./Validator");

const schema = Joi.object({
  success: Joi.boolean().required(),
  error: Joi.string(),
  message: Joi.string(),
});

module.exports = new Validator("serveResponse", schema, {allowUnknown: true});