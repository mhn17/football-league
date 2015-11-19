/**
 * app/models/match.js
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
	var Match = sequelize.define("Match", {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
		date: DataTypes.DATE,
		scoreTeam1: DataTypes.INTEGER,
		scoreTeam2: DataTypes.INTEGER		
	}, {
		classMethods: {
			associate: function(models) {
				Match.belongsTo(models.MatchDay, {as: 'matchDay'});
				Match.belongsTo(models.Team, {as: 'team1'});
				Match.belongsTo(models.Team, {as: 'team2'});
			}
		}
	});
	
	return Match;
};