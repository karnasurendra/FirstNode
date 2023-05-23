const jwt = require('jsonwebtoken');
const saltKey = 'saltValue'
const idKey = 'id'
const User = require('../models/user')


module.exports = async (request, h) => {

    console.log('checking in authentication');
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
            console.log('Failure decoded token');
            return h.response('InValid Token').code(401).takeover();
        }

        // Need to check is that latest token or not. There is a case where user did double signup
        if (saltKey in decodedToken && idKey in decodedToken) {
            const saltKey = decodedToken[saltKey];
            const idKey = decodedToken[idKey];

            const user = await User.findOne({ '_id': idKey });

            if (user) {
                if (user.saltKey == saltKey) {
                    // Attach the decoded token to the request object for further use
                    request.auth.token = decodedToken;
                    h.continue;
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
        console.log('Catch Block');
        return h.response('InValid Token').code(401).takeover();
    }



}