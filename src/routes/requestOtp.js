'use strict'
const { RequestOtp, validateOtpRequest, validateOtpVerificationRequest } = require('../models/requestOtpModel');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const routes = [

    // get-otp Helps to generate OTP for particular input mobile number
    {
        method: 'POST',
        path: '/v1/get-otp',
        handler: async (request, h) => {
            console.log('Checking the request Payload ' + request.payload.mobile_number);
            try {
                await validateOtpRequest(request.payload);
            } catch (e) {
                return h.response(e.details[0].message).code(400);
            }

            const randomNumber = Math.floor(Math.random() * 9000) + 1000;

            let oldRequest = await RequestOtp.findOne({ mobile_number: request.payload.mobile_number });

            if (oldRequest) {
                oldRequest.otp = randomNumber;
                oldRequest.isOtpRequested = true;
                oldRequest.requestedDate = Date.now();
                await oldRequest.save();
            } else {
                const requestOtp = new RequestOtp({
                    mobile_number: request.payload.mobile_number,
                    otp: randomNumber,
                    isOtpRequested: true
                });
                await requestOtp.save();
            }

            return { statusCode: 200, message: 'OTP sent successfully', otp: randomNumber };
        }
    },

    // validate-otp Helps to validate OTP associated with the requested mobile number
    {
        method: 'POST',
        path: '/v1/validate-otp',
        handler: async (request, h) => {
            try {
                await validateOtpVerificationRequest(request.payload);
            } catch (e) {
                return { statusCode: 400, message: 'Failed to validate-otp', error: e.details[0].message };
            }

            let requestOtp = await RequestOtp.findOne({ mobile_number: request.payload.mobile_number });

            // Helps to validate OTP Requested or not. If not requested then returning the user
            if (!requestOtp || !requestOtp.isOtpRequested) {
                return { statusCode: 400, message: 'First Request OTP to validate OTP' };
            }

            let currentTime = Date.now();
            let otpExpiryTime = requestOtp.requestedDate.setSeconds(requestOtp.requestedDate.getSeconds() + 60);

            requestOtp.isOtpRequested = false;

            // OTP Expired
            if (currentTime > otpExpiryTime) {
                await requestOtp.save();
                return { statusCode: 200, message: 'OTP Expired..' };
            } else {
                if (requestOtp.otp == request.payload.otp) {
                    await requestOtp.save();

                    let user = new User(_.pick(request.payload, ['mobile_number']));
                    const salt = await bcrypt.genSalt(10);
                    const token = user.generateAuthToken(salt)
                    user.saltKey = salt;
                    await user.save();

                    return { statusCode: 200, message: 'OTP verified successfully.', token: token };
                } else {
                    return { statusCode: 200, message: 'InValid OTP.' };
                }
            }
        }
    }
]


module.exports = routes;