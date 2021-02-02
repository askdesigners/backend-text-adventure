const Joi = require("joi");

const schema = Joi.object({
  command: Joi.string()
    .alphanum()
    .required(),
  jwt: Joi.string()
    .alphanum()
    .required(),
});

module.exports = schema;