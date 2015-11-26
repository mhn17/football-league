/**
 * app/routes/api/matches.js
 */

var models = require('../../models');
var express = require('express');
var router = express.Router();

/* GET list of matches */
router.get('/', function(req, res) {
	models.Match.findAll({
		include: [
			{model: models.Team, as: "team1"},
			{model: models.Team, as: "team2"}
		]
	})
	.then(function(matches) {
		res.json(matches);
	});
});

/* GET list of matches by match day*/
router.get('/match-day/:matchDayNumber', function (req, res) {
	models.Match.findAll({
		include: [
			{model: models.Team, as: "team1"},
			{model: models.Team, as: "team2"}
		],
		where: {
			matchDayNumber: req.params.matchDayNumber
		}
	})
	.then(function (matches) {
		res.json(matches);
	});
});

/* POST add a match */
router.post('/', function(req, res) {
	models.Match.create(req.body, {fields: ["matchDayNumber", "date", "team1Id", "team2Id", "scoreTeam1", "scoreTeam2"]})
		.then(function(match) {
			res.json(match.id);
		});
});

/* GET get a match */
router.get('/:id', function(req, res) {
	models.Match.findByPrimary(req.params.id)
		.then(function(match) {
			res.json(match);
		});
});

/* PUT update a match */
router.put('/:id', function(req, res) {
	models.Match.update(req.body, {where: {id: req.params.id}, fields: ["matchDayNumber", "date", "team1Id", "team2Id", "scoreTeam1", "scoreTeam2"]})
		.then(function() {
			res.json(req.params.id);
		});
});

module.exports = router;