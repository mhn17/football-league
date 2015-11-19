/**
 * app/routes/index.js
 */

var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	models.Team.findAll().then(function(teams) {
		models.MatchDay.findAll().then(function(matchDays) {
			models.Match.findAll({ 
				include: [ 
				          { model: models.Team, as: "team1" },
				          { model: models.Team, as: "team2" }
				]})
				.then(function(matches) {
					matchDays.forEach(function(matchDay) {
					matchDay.matches = matches.filter(function(match) {
						return match.matchDayNumber === matchDay.number;
					});
				});
				
				res.render('index', {teams: teams, matchDays: matchDays});
			});
		});
	});
});

module.exports = router;