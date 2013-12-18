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

var express = require('express'), 
    app = express(),
    path = require('path'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3003);


//app.get('/', function (req, res) {
//  res.sendfile('../public/index.html');
//});

app.use(express.static(path.join(__dirname, '../public')));


var pingDue = true;
var score = 0;

var broadcastScore = function(score){
	io.sockets.emit('score', { score: score});
	console.log(score);
};

var pingPong = function(type){

	if(type == 'ping' && pingDue){
		score++;
	}else if(type == 'pong' && !pingDue){
		score++;
	}else{
		score = 0;
	}

	if(type == 'ping'){
		pingDue = false;
	}else{
		pingDue = true;
	}

	broadcastScore(score);

};

io.sockets.on('connection', function (socket) {
  
  socket.on('ping', function (data) {
    socket.broadcast.emit('ping', {});
		pingPong('ping');
  });

  socket.on('pong', function (data) {
    socket.broadcast.emit('pong', {});
		pingPong('pong');
  });

});
