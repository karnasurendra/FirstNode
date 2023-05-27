const jwt = require('jsonwebtoken');
const saltValue = 'saltValue'
const idValue = '_id'
const { User } = require('../models/user')


module.exports = async (request, h) => {

    const { headers } = request;

    if (!headers.hasOwnProperty('authorization')) {
        return h.response('Missing authorization header').code(401).takeover();
    }

    const authorizationHeader = headers.authorization;

    const token = authorizationHeader.replace('Bearer ', '');

    try {
        // Verify and decode the JWT token
        const decodedToken = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        if (!decodedToken) {
            return h.response('InValid Token 1').code(401).takeover();
        }

        const saltKey = decodedToken[saltValue];
        const idKey = decodedToken[idValue];
        // Need to check is that latest token or not. There is a case where user did double signup
        if (saltKey && idKey) {

            const user = await User.findOne({ '_id': idKey });

            if (user) {
                if (user.saltKey == saltKey) {
                    // Using user object inside follow on request example in SignUp
                    request.app.loginUser = user;
                    return h.continue;
                } else {
                    return h.response('InValid Token').code(401).takeover();
                }
            } else {
                return h.response('InValid Token').code(401).takeover();
            }

        } else {
            return h.response('InValid Token').code(401).takeover();
        }
    } catch (e) {
        return h.response('InValid Token').code(401).takeover();
    }



}