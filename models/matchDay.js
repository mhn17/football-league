/**
 * models/matchDay.js
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
	var MatchDay = sequelize.define("MatchDay", {
		number: { type: DataTypes.INTEGER, primaryKey: true},
		dateFrom: DataTypes.DATEONLY,
		dateTo: DataTypes.DATEONLY
	});
	
	return MatchDay;
};