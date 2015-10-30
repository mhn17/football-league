/**
 * models/matches.js
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
	var Matches = sequelize.define("Matches", {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
		date: DataTypes.DATE,
		scoreTeam1: DataTypes.INTEGER,
		scoreTeam2: DataTypes.INTEGER		
	}, {
		classMethods: {
			associate: function(models) {
				Matches.belongsTo(models.MatchDay, {as: 'matchDay'});
				Matches.belongsTo(models.Team, {as: 'team1'});
				Matches.belongsTo(models.Team, {as: 'team2'});
			}
		}
	});
	
	return Matches;
};