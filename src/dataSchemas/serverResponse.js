const Joi = require("joi");

const schema = Joi.object({
  error: Joi.string()
    .alphanum(),
  success: Joi.boolean()
    .required(),
});

module.exports = schema;