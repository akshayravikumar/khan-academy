var acorn = require('acorn');
var acornWalk = require("acorn/dist/walk");
var db = require('./database');

// check if an AST contains a particular node type
contains = function(node, target) {
	return acornWalk.findNodeAt(node, null, null, target, null, null) !== undefined;
}

firstError = undefined;
matches = function(node, target) {
	// console.log(node, target);
	if (target.length === 0) {
		return true;
	}
	// it just has to amtch inside the node, so 
	var curPos = node.start;
	var curLine = node.loc.start.line;
	// children have to be inside the current node
	for (var i = 0; i < target.length; i++) {
		// look for the children, one by one
		while (true) {
			var poss = acornWalk.findNodeAfter(node, curPos, target[i].type, null, null);
			// if the node doesn't exist, we're done
			if (poss === undefined) {
				if (firstError === null) {
					firstError = {
						line: curLine,
						missing: target[i].type, 
						parent: node.type,
						previous: (prev !== undefined) ? prev.node.type : undefined,
						explanation: target[i].explanation
					};
				}
				return false;
			}
			// now, look for the next child after the current child ends
			// this is to maintain order
			curPos = poss.node.end;
			curLine = poss.node.loc.end.line;
			// if it matches, break move on to the next child
			// if not, then let's look for the next node of the same type
			if (matches(poss.node, target[i].children)) {
				break;
			}
		}
		var prev = poss.node; 
		// yay we found them all!
		if (i === target.length - 1) {
			return true;
		}
	}
}

validate = function(source, id, cb) {
	errors = [];
	db.getProblem(id, function(problem, err) {
		if (err) {
			errors.push({
				type: "data",
				explanation: "Oh no! Looks like this problem doesn't exist."
			});
			cb(errors);
			return;
		}

		var blacklist = problem["blacklist"];
		var whitelist = problem["whitelist"];
		var structure = problem["structure"];

		try {
			rootNode = acorn.parse(source, {locations: true});
		} catch (error) {
			errors.push({
				type: "parse",
				explanation: error
			});
			cb(errors);
			return;
		}

		for (var i=0; i<whitelist.length; i++) {
			if (!contains(rootNode, whitelist[i].type)) {
				errors.push({
					type: "whitelist",
					data: whitelist[i].type,
					explanation: whitelist[i].explanation
				});
			}
	 	}

		for (var i=0; i<blacklist.length; i++) {
			if (contains(rootNode, blacklist[i].type)) {
				errors.push({
					type: "blacklist",
					data: blacklist[i].type,
					explanation: blacklist[i].explanation
				});
			}
	 	}

	 	// if we're missing something, might as well not check structure
	 	if (errors.length === 0) {
	 		firstError = null;
			m = matches(rootNode, structure)
			if (!m) {
				// here, we can safely guess the line number
				message = "It should be somewhere after line " + firstError.line + ".";
				errors.push({
					type: "structure",
					message: message,
					line: firstError.line,
					explanation: firstError.explanation + " " + message
				});
			}
		}

		cb(errors);
	});
}

module.exports = validate;
