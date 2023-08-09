import * as Joi from 'joi';

export const userValidation = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.number().integer().required(),
    password: Joi.string().required(),
    roleId: Joi.number().required()
});

export const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export const sendOtpValidation = Joi.object({
    email: Joi.string().email().required(),
    type: Joi.string().required().valid('LOGIN', 'FORGOT_PASSWORD', 'VERIFICATION'),
})

export const verifyOtpValidation = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
})

export const forgotPasswordValidation = Joi.object({
    email: Joi.string().email().required(),
    type: Joi.string().required().valid('LOGIN', 'FORGOT_PASSWORD', 'VERIFICATION'),
})

export const resetPasswordValidation = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
    newPassword: Joi.string().required(),
})

export const profileValidation = Joi.object({
    userId: Joi.number().required(),
    profilePicId: Joi.number().required(),
    line_1: Joi.string(),
    line_2: Joi.string(),
    locality: Joi.string(),
    cityId: Joi.number().required(),
    gender: Joi.string().required().valid('MALE', 'FEMALE', 'OTHER'),
    qualification: Joi.string(),
    latitude:Joi.string(),
    longitude: Joi.string(),
    linkedIn_url: Joi.string(),
    facebook_url: Joi.string(),
    zip: Joi.number().required(),
})

