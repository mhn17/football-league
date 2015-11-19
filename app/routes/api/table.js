/**
 * app/routes/api/teams.js
 */

var async = require('async');
var express = require('express');
var router = express.Router();
var TableService = require('./../../services/tableService');
var models = require('../../models');

/* GET current table */
router.get('/', function (req, res) {
	var tableParameters = {};
	
	tableParameters.matches = function(callback) {
		models.Match.findAll().then(function (matches) {
			callback(null, matches);
		});
	};
	
	tableParameters.teams = function(callback) {
		models.Team.findAll().then(function (teams) {
			callback(null, teams);
		});
	};
	
	async.parallel(tableParameters, function (err, results) {
		var tableService = new TableService(results.matches, results.teams);
		res.json(tableService.getCurrentTable());
	});
});

module.exports = router;