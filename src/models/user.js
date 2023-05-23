const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
  mobile_number: {
    type: String,
    minlength: 10,
    maxlength: 10,
    unique: true,
    require: true
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
    unique: true
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
  saltKey: String
});

userSchema.methods.generateAuthToken = function (saltValue) {
  const expiryTime = '3m'; // Token expiry time 3 months
  const token = jwt.sign({ _id: this._id, saltValue: saltValue }, process.env.JWT_PRIVATE_KEY, { expiryTime });
  return token;
}

const User = new mongoose.model('User', userSchema);


module.exports.User = User;