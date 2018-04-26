var mongoose = require('mongoose');
var dbURL = 'mongodb://localhost:27017/Profiles';

var connection = mongoose.connect(dbURL);

mongoose.connection.on('connected', function(){
    console.log("Mongoose connected to "+dbURL);
});

mongoose.connection.on('disconnected', function(){
    console.log("Mongoose disconnected");
});

mongoose.connection.on('error', function(){
    console.log("Mongoose connection error " + err);
});

module.exports.get = function(){
   return connection;
};
require('./Profile.model.js');