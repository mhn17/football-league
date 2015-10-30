/**
 * routes/api/teams.js
 */

var models = require('../../models');
var express = require('express');
var router = express.Router();

/* GET list of teams */
router.get('/', function(req, res) {
	models.Team.findAll().then(function(teams) {
		res.json(teams);
	});
});

/* POST add a team */
router.post('/', function(req, res) {
	models.Team.create(req.body, {fields: ["name", "team", "player1", "player2"]})
		.then(function(team) {
			res.json(team.id);
		});
});

/* GET get a team */
router.post('/:id', function(req, res) {
	models.Team.findByPrimary(req.params.id)
		.then(function(team) {
			res.json(team);
		});
});

/* PUT update a team */
router.put('/:id', function(req, res) {
	models.Team.update(req.body, {where: {id: req.params.id}, fields: ["name", "team", "player1", "player2"]})
		.then(function() {
			res.json(req.params.id);
		});
});

module.exports = router;