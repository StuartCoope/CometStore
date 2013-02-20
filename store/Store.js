var Storable = require('./Storable');

var objectExpireLifetime = 60000;

/* Constructor */
function Store(){

	var self = this;
	this.currentID = 0;
	this.objects = {}; //array of 'storable' objects

	this.eventsCount = 0;
	this.objectCount = 0;
	this.purgedCount = 0;

	this.purge = function(){

		for(var i in self.objects){
			//console.log(self.objects[i]);
			var current = self.objects[i];

			if(current.lastAccess < (Date.now() - objectExpireLifetime) ){
				delete self.objects[i];
				self.purgedCount++;
			}
		}

		if(self.purgedCount > 0){
			console.log("Cleaned up: " + self.purgedCount);
			console.log("Remaining Object count: " + self.length() );
		}

		self.purgedCount = 0;

		self.cleanUpTimeout = setTimeout(self.purge, 10000);
	};

	//purging off during dev
	//this.cleanUpTimeout = setTimeout(self.purge, 10000);
}

Store.prototype.length = function(){
	var count = 0;
	for(var i in this.objects){
		count++;
	}
	return count;
}

Store.prototype.newIdentifier = function(){

	this.eventsCount++;

	this.currentID++;
	return this.currentID;
}

Store.prototype.add = function(object){

	this.eventsCount++;
	this.objectCount++;

	identifier = this.newIdentifier();

	this.objects[identifier] = new Storable(object);

	return identifier;
}

Store.prototype.get = function(identifier){

	this.eventsCount++;

	if(foundObject = this.objects[identifier]){
		//return a clone of foundObject, with the subscriptions
		foundObject.accessed();
		return foundObject;
	}else{
		return null;
	}
};

Store.prototype.update = function(identifier, object){

	this.eventsCount++;

	if(foundObject = this.objects[identifier]){
		foundObject.update(object);
		return identifier;
	}else{
		return null;
	}
};

module.exports = Store;