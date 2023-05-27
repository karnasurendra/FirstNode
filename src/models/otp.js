const Joi = require('joi');
const mongoose = require('mongoose');

const requestOtpSchema = new mongoose.Schema({
    mobile_number: {
        type: Number,
        minlength: 10,
        maxlength: 10,
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        minlength: 4,
        maxlength: 4,
    },
    requestedDate: {
        type: Date,
        default: Date.now
    },
    isOtpRequested: {
        type: Boolean,
        default: false
    }
});

const RequestOtp = mongoose.model('RequestOtp', requestOtpSchema);

function validateOtpRequest(params) {
    const schema = Joi.object({
        mobile_number: Joi.string().length(10).pattern(/^[0-9]+$/).required()
    });
    return schema.validateAsync(params);
}

function validateOtpVerificationRequest(params) {
    const schema = Joi.object({
        mobile_number: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        otp: Joi.string().length(4).pattern(/^[0-9]+$/).required()
    });
    return schema.validateAsync(params);
}


module.exports.RequestOtp = RequestOtp;
module.exports.validateOtpRequest = validateOtpRequest;
module.exports.validateOtpVerificationRequest = validateOtpVerificationRequest;



