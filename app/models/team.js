/**
 * app/models/team.js
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
	var Team = sequelize.define("Team", {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
		name: DataTypes.STRING,
		team: DataTypes.STRING,
		player1: DataTypes.STRING,
		player2: DataTypes.STRING
	});
	
	return Team;
};