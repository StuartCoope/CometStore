var Events = require('events');

/* Constructor */
function Storable(toStore){

	//create an even listener for unlimited subscribers
	this.subscriptions = new Events.EventEmitter();
	this.subscriptions.setMaxListeners(0);

	//store the object
	this.storeObject(toStore);
}


Storable.prototype.storeObject = function(toStore){
	this.lastAccess = new Date().getTime();
	this.lastModified = new Date().getTime();

	this.storedObject = toStore;
	this.subscriptions.emit('change');
};

Storable.prototype.getStoredObject = function(){
	return {
		lastAccess: this.lastAccess,
		lastModified: this.lastModified,
		storedObject: this.storedObject
	};
}

Storable.prototype.accessed = function(){
	this.lastAccess = new Date().getTime();
}

Storable.prototype.subscribe = function(listener){
	this.subscriptions.addListener('change', listener);
};

Storable.prototype.unsubscribe = function(listener){
	this.subscriptions.removeListener('change', listener);
};

/* Emit update events */
Storable.prototype.update = function(toStore){
	this.storedObject = toStore;
	
	this.lastAccess = new Date().getTime();
	this.lastModified = new Date().getTime();

	this.subscriptions.emit('change');
}

module.exports = Storable;