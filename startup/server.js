'use strict'

const Hapi = require('hapi');
const authRoutes = require('../src/routes/requestOtp');
const signUp = require('../src/routes/signup');
const { logger, errorHandlerMiddleware } = require('./logger');

const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
        payload: {
            parse: true
        }
    }
});

// Helps to add route
module.exports = server;

// Register the error handling middleware
server.ext('onPreResponse', errorHandlerMiddleware);

async function startServer() {
    try {

        server.route(authRoutes);
        server.route(signUp);

        await server.start()
        console.log('server on runnning on ' + server.info.uri);
    } catch (err) {
        console.log('Failed to start server ' + err);
    }
};


startServer();