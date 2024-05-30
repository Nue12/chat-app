const Joi = require("joi");

const validator = (schema: any) => (payload: {}) =>
  schema.validate(payload, { abortEarly: false });

const Signupschema = Joi.object({
  email: Joi.string().trim().required().email(),
  password: Joi.string().trim().min(6).max(16).required(),
});

const validateSignup = validator(Signupschema);

export { validateSignup };
