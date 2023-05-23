const { request } = require('http');
const User = require('../models/user');
const auth = require('../middlewares/auth');

const routes = [
    {
        method: 'POST',
        path: '/v1/signup-one',
        config: {
            pre: [
                { method: auth, assign: 'authorization' }
            ],
            handler: async (request, h) => {
                return  "Successfully validated";
            }
        }
    }
]

module.exports = routes;