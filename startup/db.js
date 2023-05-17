const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect('mongodb://localhost/FirstNode')
        .then(() => console.log('Successfully connected to DB'))
        .catch((err) => console.log('Error connecting to DB ' + err));
}


