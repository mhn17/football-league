/**
 * app/routes/index.js
 */

var async = require('async');
var models  = require('./../models');
var express = require('express');
var router = express.Router();
var TableService = require('./../services/tableService')

/* GET home page. */
router.get('/', function(req, res) {
	var parameterStack = {};
	
	parameterStack.matchData = function(callback) {
		models.MatchDay.findAll().then(function (matchDays) {
			models.Match.findAll({
				include: [
					{model: models.Team, as: "team1"},
					{model: models.Team, as: "team2"}
				]})
				.then(function (matches) {
					matchDays.forEach(function (matchDay) {
						matchDay.matches = matches.filter(function (match) {
							return match.matchDayNumber === matchDay.number;
						});
					});
					
					callback(null, {matchDays: matchDays, matches: matches});
				});
		});
	};
	
	parameterStack.teams = function(callback) {
		models.Team.findAll().then(function (teams) {
			callback(null, teams);
		});		
	};
	
	async.parallel(parameterStack, function(err, results) {
		var tableService = new TableService(results.matchData.matches, results.teams);
		var table =  tableService.getCurrentTable();
		res.render('index', {
			table: tableService.getCurrentTable(),
			teams: results.teams, 
			matchDays: results.matchData.matchDays
		});
	});
});

module.exports = router;