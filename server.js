'use strict'

const Hapi = require('hapi');
const authRoutes = require('./routes/authentication/auth');

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

async function startServer() {
    try {

        server.route(authRoutes);

        await server.start()
        console.log('server on runnning on ' + server.info.uri);
    } catch (err) {
        console.log('Failed to start server ' + err);
    }
};


startServer();