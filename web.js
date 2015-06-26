// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var favicon = require('serve-favicon');

// get environment variables =================
var jade = require('jade');

// configuration =================
app.use(express.static(__dirname + '/'));                   // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(favicon(__dirname + '/favicon.ico'));
// listen (start app with node server.js) ======================================
app.listen(process.env.PORT || 5000);
console.log("App listening on port 5000");