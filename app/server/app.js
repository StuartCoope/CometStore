"use strict";

/**
 * Module dependencies.

var express = require('express'),
	http = require('http'),
	path = require('path');

var store = require('./store');

var app = express();

// all environments
app.set('port', process.env.PORT || 3006);
app.set('views', __dirname + '/views');

app.set('view engine', 'jade');
app.set('view options', {layout: true});

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, '../public')));

app.use(store);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

*/

var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3003);


app.get('/', function (req, res) {
  res.sendfile('../public/index.html');
});


//app.use(express.static(path.join(__dirname, '../public')));

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});