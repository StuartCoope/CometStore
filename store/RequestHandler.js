var simpleStore;

function RequestHandler(s){
	simpleStore = s;
}

RequestHandler.prototype.storeRequest = function(req, res){
	//collect data before we do anything
	var body = "";

	req.on('data', function(chunk){
		body += chunk;
	});

	req.on('end', function(){
		//we have our data, store it
		try{
			var parsedObject = JSON.parse(body);
			var id = simpleStore.add(parsedObject);

			if(id){
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.writeHead(200);
				res.write(JSON.stringify({
					storedID: id
				}));

				res.end();
			}else{
				//something went wrong
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.writeHead(300);
				res.end('Whoops!');
			}
		}catch(jsonParseError){
			console.log("JSON Parse Error");
			console.log(jsonParseError);

			res.setHeader("Access-Control-Allow-Origin", "*");
			res.writeHead(500);
			res.end('Invalid JSON');
		}
	});
};

RequestHandler.prototype.updateRequest = function(req, res){
	//collect data before we do anything
	var body = "";

	req.on('data', function(chunk){
		body += chunk;
	});

	req.on('end', function(){
		
		//we have our data, store it
		try{
			var target = req.params.objectId;
			var parsedObject = JSON.parse(body);
			var id = simpleStore.update(target, parsedObject);

			if(id){
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.writeHead(200);
				res.write(JSON.stringify({
					storedId: id
				}));

				res.end();
			}else{
				//something went wrong
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.writeHead(500);
				res.end('Update ID no longer exists');
			}

		}catch(jsonParseError){
			console.log("JSON Parse Error");
			console.log(jsonParseError);

			res.setHeader("Access-Control-Allow-Origin", "*");
			res.writeHead(500);
			res.end('Invalid JSON');

		}
		
	});
};

RequestHandler.prototype.getRequest = function(req, res){
	var desired = simpleStore.get(req.params.objectId);

	if(desired){
		res.writeHead(200);
		res.write(JSON.stringify({
			data: desired.getStoredObject()
		}));
		res.end();
	}else{
		res.writeHead(500);
		res.end('No item');
	}
};

RequestHandler.prototype.subscribeRequest = function(req, res){

	var desired = simpleStore.get(req.params.objectId);

	if(desired){
		//set the headers to keep them listening
		res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*', "Connection": 'Close'});

		//check if we have any updates since req.params.lastEventTimestamp
		if(desired.lastModified > req.params.lastEventTimestamp){
			//return immediately
			res.write(JSON.stringify({
				data: desired.getStoredObject()
			}));
			res.end();
		}else{
			var timeout;
			var listener;

			//add to subscriber queue to get an event when an update is emitted
			listener = function(){
				//we have been notified that a change has occurred, or we have timed out, return the item
				res.write(JSON.stringify({
					data: desired.getStoredObject()
				}));

				res.end();

				//remove timeout and unsubscribe from the event
				clearTimeout(timeout);
				desired.unsubscribe(listener);
			};

			//subscribe to changes to the object, timeout after 30 seconds
			desired.subscribe(listener);
			timeout = setTimeout(function(){
				res.write(JSON.stringify({
					data: desired.getStoredObject()
				}));
			}, 30000);
		}

	}else{
		res.writeHead(500);
		res.end('No item');
	}
};

module.exports = RequestHandler;