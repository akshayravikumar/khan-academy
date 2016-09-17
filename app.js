var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var validate = require('./validate');
var db = require('./database');
var bodyParser = require('body-parser')
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

// set root directory
process.env.PWD = process.cwd();

// set public folder
app.use(express.static(process.env.PWD + '/public'));

// general error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});

app.post('/validate', function (req, res) {
  	validate(req.body.source, req.body.id, function(errors) {
  		res.send({
  			errors: errors,
  		});
 	});
});

app.get('/api/problems/:id*', function(req, res) {
	db.getProblem(req.param('id'), function(problem, err) {
		if (err) {
			res.send({
				error: err
			});
		} else {
			res.send({
				problem: problem
			});
		}
	});
});

app.get('/api/all_problems', function(req, res) {
	db.getAllProblems(function(problems, err) {
		if (err) {
			res.send({
				error: err
			});
		} else {
			res.send({
				problems: problems
			});
		}
	});
});

app.use(function(req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
});

// set port, listen and log 
app.listen(port, function() {
    console.log("browsing at localhost:" + port);
});

module.exports = app;