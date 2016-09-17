var jsonDB = require('node-json-db');
var db = new jsonDB("problems", true, true);

database = {};

database.getProblem = function(id, cb) {
	try {
		data = db.getData("/" + id);
		cb(data, null);
	} catch (e) {
		cb(null, "Looks like this problem doesn't exist :(");
	}
}

database.getAllProblems = function(cb) {
	try {
		data = db.getData("/");
		shortened = Object.keys(data).reduce(function(previous, id) {
		    previous[id] = {
		    	title: data[id].title,
		    	statement: data[id].statement,
		    	id: id
		    }
		    return previous;
		}, {});
		cb(shortened, null);
	} catch (e) {
		cb(null, "Oh no! Something went wrong: " + e);
	}
}

module.exports = database;