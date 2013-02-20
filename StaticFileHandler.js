var fs = require('fs');
var path = require('path');

var localPath = '/var/lib/jenkins/workspace/Comet Store/www'

function StaticFileHandler(){
	
    var self = this;

    this.getStaticFile = function(request, response){

        var filePath = localPath + request.url;

        self.getFileContent(filePath, function(error, content){

            if (!content || error === true) {
                response.writeHead(500);
                response.end();
            }

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

            
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
            

        });
    };

    this.getFileContent = function(filePath, callback){

        fs.lstat(filePath, function(err, stats) {

            if(!stats){
                //is not a file OR directory
                console.log('404 baby');
                callback(true, false);
                return;
            }

            if(stats.isDirectory()){
                self.getFileContent(filePath + '/index.html', callback);
                return;
            }

            fs.readFile(filePath, function(error, content) {
                callback(error, content);
            });
        });

    };

}

module.exports = StaticFileHandler;
