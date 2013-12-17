"use strict";

var express = require('express'),
	path = require('path'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	socket.emit('news', {hello: 'world' });
	socket.on('my other event', function(data){
		console.log(data);
	});
});
