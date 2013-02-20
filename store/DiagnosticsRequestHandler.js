var fs = require('fs');
var path = require('path');


function DiagnosticsRequestHandler(d){
	this.diagnostics = d;
}

DiagnosticsRequestHandler.prototype.getStaticFile = function(request, response){

	var filePath = '/var/lib/jenkins/workspace/Comet Store/www/' + request.url;
         
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
     
    console.log('Looking for: ' + filePath);

    fs.exists(filePath, function(exists) {
        if (exists) {
        	console.log('exists');
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
        	console.log('404 baby');
            response.writeHead(404);
            response.end();
        }
    });

};

DiagnosticsRequestHandler.prototype.performanceInfoRequest = function(req, res){
	var desired = this.diagnostics.getPerformanceInfo();

	res.setHeader("Access-Control-Allow-Origin", "*");

	if(desired){
		res.writeHead(200);
		res.write(JSON.stringify({
			data: desired
		}));
		res.end();
	}else{
		res.writeHead(404);
		res.end('No item');
	}
};

DiagnosticsRequestHandler.prototype.getEnvironmentInfoRequest = function(req, res){
	var desired = this.diagnostics.getEnvironmentInfo();

	res.setHeader("Access-Control-Allow-Origin", "*");

	if(desired){
		res.writeHead(200);
		res.write(JSON.stringify({
			data: desired
		}));
		res.end();
	}else{
		res.writeHead(404);
		res.end('No item');
	}
};

module.exports = DiagnosticsRequestHandler;
