const Joi = require("joi");
const Validator = require("./Validator");

const schema = Joi.object({
  success: Joi.boolean().required(),
  error: Joi.string(),
  message: Joi.string(),
  place: Joi.object({
    name: Joi.string(),
    descriptiveName: Joi.string(),
    description: Joi.string(),
  }),
  user: Joi.object({
    _id: Joi.string().alphanum().required(),
    name: Joi.string(),
    description: Joi.string(),
    x: Joi.number(),
    y: Joi.number(),
    health: Joi.number(),
    strength: Joi.number(),
    inventory: Joi.array(),
    holding: Joi.object(),
  }).required()
});

module.exports = new Validator("moveResponse", schema, {convert: true});