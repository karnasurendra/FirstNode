const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
  mobile_number: {
    type: String,
    minlength: 10,
    maxlength: 10,
    unique: true,
    required: true
  },
  first_name: {
    type: String,
    minlength: 5,
    maxlength: 50
  },
  last_name: {
    type: String,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    sparse: true,  // Allow multiple documents to have empty email fields
    default: null,
    validate: {
      validator: function (value) {
        return value === null || value !== '';
      },
      message: 'Email must be either null or non-empty'
    }
  },
  dob: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER']
  },
  weight: {
    value: Number,
    measuredType: {
      type: String,
      enum: ['KGS', 'LBS']
    }
  },
  height: {
    value: Number,
    measuredType: {
      type: String,
      enum: ['CMS', 'FEET']
    }
  },
  bmi: {
    value: Number,
    measuredType: {
      type: String,
      enum: ['Underweight', 'Normal weight', 'Overweight', 'Obesity (Class 1)', 'Obesity (Class 2)', 'Extreme Obesity (Class 3)']
    }
  },
  saltKey: String
});

// Create a unique index for non-empty email values
userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $ne: null }, email: { $ne: '' } } });

userSchema.methods.generateAuthToken = function (saltValue) {
  // Set the expiration time to 3 months (in seconds)
  const expirationTime = Math.floor(Date.now() / 1000) + (3 * 30 * 24 * 60 * 60);

  const token = jwt.sign({ _id: this._id, saltValue: saltValue }, process.env.JWT_PRIVATE_KEY, { expiresIn: expirationTime });
  return token;
}

const User = new mongoose.model('User', userSchema);

function validateSignUpUserOne(params) {
  const joiSchema = Joi.object({
    first_name: Joi.string().min(5).max(50).required(),
    last_name: Joi.string().min(5).max(50).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    dob: Joi.number().required(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').required()
  });
  return joiSchema.validateAsync(params);
}

function validateSignUpUserTwo(params) {
  const joiSchema = Joi.object({
    weight: Joi.object({
      value: Joi.number().required(),
      measuredType: Joi.string().valid('KGS', 'LBS').required()
    }).required(),
    height: Joi.object({
      value: Joi.number().required(),
      measuredType: Joi.string().valid('CMS', 'FEET').required()
    }).required(),
    bmi: Joi.object({
      value: Joi.number().required(),
      measuredType: Joi.string().
        valid('Underweight', 'Normal weight', 'Overweight',
          'Obesity (Class 1)', 'Obesity (Class 2)', 'Extreme Obesity (Class 3)').required()
    }).required()
  })
  return joiSchema.validateAsync(params);
}


module.exports.User = User;
module.exports.validateSignUpUserOne = validateSignUpUserOne;
module.exports.validateSignUpUserTwo = validateSignUpUserTwo;