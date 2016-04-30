'use strict'; 

var app = require('express')();

// need a var here to keep track of an instructor already having logged in

const fs = require('fs');

var path = require('path'),
    url  = require('url'),
    express = require('express'),
    http = require('http').Server(app),
    //io = require('socket.io').listen(http); // maybe this works better with Heroku?
    io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
  //var clientFile = path.resolve(__dirname + '/../index.html'); 
  var clientFile = path.resolve('public/gateway.html'); 
  res.sendFile(clientFile);
});

io.on('connection', function(socket) {
  console.log('io.on connection...');
  socket.on('chat message', function(msg) {
    console.log('socket.on chat message...');
    io.emit('chat message', msg);
  });
  // custom event for transmitting main board move to students
  socket.on('newpos', function(pos) { 
    io.emit('newpos', pos);
  });
});

io.on('connection', function(socket) {
  console.log('a user connected'); 
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});
// do not hard-code the port for Heroku app!
/*
http.listen(3000, function() {
  console.log('listening on *:3000');
});*/
app.listen(process.env.PORT || 3000, function() { 
  console.log("Listening on port %d in %s mode", this.address().port, app.settings.env); 
}); 
