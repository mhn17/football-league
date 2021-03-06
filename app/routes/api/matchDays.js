/**
 * app/routes/api/matchDays.js
 */

var models = require('../../models');
var express = require('express');
var router = express.Router();

/* GET list of match days */
router.get('/', function(req, res) {
	models.MatchDay.findAll().then(function(matchDays) {
		res.json(matchDays);
	});
});

/* POST add a match day */process.php
router.post('/', function(req, res) {
	models.MatchDay.create(req.body, {fields: ["number", "dateFrom", "dateTo"]})
		.then(function(matchDay) {
			res.json(matchDay.number);
		})
		.catch(function (error) {
			res.status(400).json(error);
		});
});

/* GET get a match day */
router.get('/:number', function(req, res) {
	models.MatchDay.findByPrimary(req.params.number)
		.then(function(matchDay) {
			res.json(matchDay);
		})
		.catch(function (error) {
			res.status(400).json(error);
		});;
});

/* PUT update a match day */
router.put('/:number', function(req, res) {
	models.MatchDay.update(req.body, {where: {number: req.params.number}, fields: ["number", "dateFrom", "dateTo"]})
		.then(function() {
			res.json(req.params.number);
		})
		.catch(function (error) {
			res.status(400).json(error);
		});;
});

module.exports = router;