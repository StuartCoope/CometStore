/* Includes */
var Sys = require('sys');
var Http = require('http');
var Router = require('router');

/* Our Modules */
var Store = require('./store/Store');
var RequestHandler = require('./store/RequestHandler');

var Diagnostics = require('./store/Diagnostics');
var DiagnosticsRequestHandler = require('./store/DiagnosticsRequestHandler');

var StaticFileHandler = require('./StaticFileHandler');

var simpleStore = new Store();
var monitorAssistant = new Diagnostics(simpleStore, Http.globalAgent);
var staticFileHandler = new StaticFileHandler();

/* Routing */
var route = Router();

var handler = new RequestHandler(simpleStore);
var diagnosticsRequestHandler = new DiagnosticsRequestHandler(monitorAssistant);

console.log(handler);

Sys.puts('Instance started at: ' + new Date() );

/*
 *	Ninja Store Paths
 */

/* Index */
route.get('/store', function(req, res){
	res.writeHead(200);
	res.end('Index page');
});

/* Store new */
route.post('/store/set', function(req, res){
	handler.storeRequest(req, res);
});

/* Update */
route.post('/store/set/{objectId}', function(req, res){
	handler.updateRequest(req, res);
});

route.get('/store/get/{objectId}', function(req, res){
	handler.getRequest(req, res);
});

route.get('/store/subscribe/{objectId}/{lastEventTimestamp}', function(req, res){
	handler.subscribeRequest(req, res);
});

/*
 *	Ninja Store Diagnostic Paths
 */
route.get('/diagnostics/getPerformanceInfo', function(req, res){
	diagnosticsRequestHandler.performanceInfoRequest(req, res);
});;

route.get('/diagnostics/getEnvironmentInfo', function(req, res){
	diagnosticsRequestHandler.getEnvironmentInfoRequest(req, res);
});

/* 404 */
route.get(function(req, res){
	//static file handler
	staticFileHandler.getStaticFile(req, res);
	
});

Http.globalAgent.maxSockets = 500
//x = new Http.Agent()
//Http.request({agent:x})

var server = Http.createServer(route).listen(8001);

Sys.puts('Server running at http://localhost:8001/');
