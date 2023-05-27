const { request } = require('http');
const { User, validateSignUpUserOne, validateSignUpUserTwo } = require('../models/user');
const auth = require('../middlewares/auth');
const _ = require('lodash');

const routes = [
    {
        method: 'POST',
        path: '/v1/signup-one',
        config: {
            pre: [
                { method: auth, assign: 'authorization' }
            ],
            handler: async (request, h) => {
                try {
                    const params = _.pick(request.payload, ['first_name', 'last_name', 'email', 'dob', 'gender']);
                    await validateSignUpUserOne(params);
                    // While checking token we are checking user availability, so Passing that user reference here
                    let user = request.app.loginUser;
                    user.first_name = params.first_name;
                    user.last_name = params.last_name;
                    user.email = params.email;
                    user.dob = params.dob;
                    user.gender = params.gender;

                    await user.save();

                    return {
                        statusCode: 200, message: 'Successfully SignUp..',
                        data: _.pick(user, ['mobile_number', 'first_name', 'last_name', 'email', 'dob', 'gender'])
                    };
                } catch (e) {
                    console.log('------- ' + e.message)
                    return { statusCode: 200, message: 'Failed to SignUp', data: e.message };
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/v1/signup-two',
        config: {
            pre: [
                { method: auth, assign: 'authorization' }
            ],
            handler: async (request, h) => {
                try {
                    const params = _.pick(request.payload, ['weight', 'height', 'bmi']);
                    await validateSignUpUserTwo(params);
                    // While checking token we are checking user availability, so Passing that user reference here
                    let user = request.app.loginUser;
                    user.weight = params.weight;
                    user.height = params.height;
                    user.bmi = params.bmi;
                    await user.save();

                    return { statusCode: 200, message: 'Successfully SignUp..', data: _.pick(user, ['weight', 'height', 'bmi']) };
                } catch (e) {
                    console.log('------- ' + e.message)
                    return { statusCode: 200, message: 'Failed to SignUp', data: e.message };
                }
            }
        }
    }
]

module.exports = routes;