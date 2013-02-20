var Util = require('util');
var Http = require('http');

function Diagnostics(store){

	this.store = store;

	var self = this;
	var lastMinutesEventCount = 0;
	var lastMinutesObjectCount = 0;

	this.eventsPerMinute = 0;
	this.objectsPerMinute = 0;

	this.calculatePerMinuteValues = function(){
		
		self.eventsPerMinute = self.store.eventsCount - lastMinutesEventCount;
		self.objectsPerMinute = self.store.length() - lastMinutesObjectCount;
		
		lastMinutesEventCount = self.store.eventsCount;
		lastMinutesObjectCount = self.store.length();

	}

	this.perMinuteCalculator = setInterval(this.calculatePerMinuteValues, 60000);
}

Diagnostics.prototype.getEventsPerMinute = function(){
	return this.eventsPerMinute;
};

Diagnostics.prototype.getObjectsPerMinute = function(){
	return this.objectsPerMinute;
};

Diagnostics.prototype.getStoredObjectCount = function(){
	return this.store.length();
};

Diagnostics.prototype.getMemoryUsage = function(){
	return Util.inspect(process.memoryUsage());
};


Diagnostics.prototype.getPerformanceInfo = function(){
	
	console.log(Http.globalAgent);
	console.log(Http.globalAgent.sockets);

	return{
		eventsPerMinute: this.getEventsPerMinute(),
		objectsPerMinute: this.getObjectsPerMinute(),
		storedObjectCount: this.getStoredObjectCount(),
		memoryUsage: this.getMemoryUsage(),
		uptime: process.uptime(),
		queuedRequests: 0
	}
}

Diagnostics.prototype.getEnvironmentInfo = function(){
	return {
		pid: process.pid,
		processTitle: process.title,
		architecture: process.arch,
		platform: process.platform,
		workingDirectory: process.cwd()
	}
};

module.exports = Diagnostics;