'use strict'
const mongoose = require('mongoose');

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            console.log('Checking the request Payload ' + request.payload);
            return 'GET Request working!';
        }
    },
    {
        method: 'GET',
        path: '/testing',
        handler: (request, h) => {
            console.log('Checking the request Payload ' + request.payload);
            return 'GET Request oneMore!';
        }
    },
    {
        method: 'POST',
        path: '/auth',
        handler: (request, h) => {
            console.log('Checking the request Payload ' + request.payload);
            return h.response({ Checking: "Hello" });
        }
    }
]

module.exports = routes;