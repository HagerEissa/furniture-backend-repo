const Joi = require("joi");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const egyptPhoneRegex = /^(?:\+20)?1[0125][0-9]{8}$/;

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
        .pattern(emailRegex)
        .required()
        .messages({ "string.pattern.base": "Email must be a valid email address" }),
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
        "string.pattern.base":
            "Password must contain at least 8 characters, including uppercase, lowercase letters, and numbers.",
        }),
    phone: Joi.string().pattern(egyptPhoneRegex).optional().messages({
        "string.pattern.base": "Phone must be a valid Egyptian phone number",
    }),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .pattern(emailRegex)
        .required()
        .messages({ "string.pattern.base": "Email must be a valid email address" }),
    password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
