/**
 * app/services/tableService.js
 */

var TableRow = require('./tableRow');

/**
 * 
 * @param {array} matches All matches
 * @param {array} teams All teams
 * @returns {nm$_tableService.TableService}
 */
function TableService(matches, teams) {
	this.matches = matches;
	this.teams = teams;
}

/**
 * Get the current table by calculating all values for the table rows
 * and sorting the table
 * 
 * @returns {array} Sorted table
 */
TableService.prototype.getCurrentTable = function() {
	var table = [];
	
	var self = this;
	this.teams.forEach(function (team) {
		table.push(self.calculateTableRow(team));
	});
	
	return this.sortTable(table);
};

/**
 * 
 * @param {Team} team
 * @returns {TableRow}
 */
TableService.prototype.calculateTableRow = function(team) {
	var self = this;
	
	var tableRow = new TableRow();
	tableRow.teamId			= team.id;
	tableRow.teamName		= team.name;
	tableRow.matchesPlayed	= 0;
	tableRow.matchesWon		= 0;
	tableRow.matchesDrawn	= 0;
	tableRow.matchesLost	= 0;
	tableRow.goalsFor		= 0;
	tableRow.goalsAgainst	= 0;
	tableRow.goalDifference = 0;
	tableRow.points			= 0;
	
	this.matches.forEach(function (match) {
		if (match.team1Id === tableRow.teamId) {
			tableRow = self.updateTableRowForMatch(tableRow, match.scoreTeam1, match.scoreTeam2);			
		}
		else if (match.team2Id === tableRow.teamId) {
			tableRow = self.updateTableRowForMatch(tableRow, match.scoreTeam2, match.scoreTeam1);
		}
	});
	tableRow.goalDifference = tableRow.goalsFor - tableRow.goalsAgainst;
	return tableRow;
};

/**
 * Helper method for calculating a table row
 * 
 * @param {TableRow} tableRow
 * @param {int} score1
 * @param {int} score2
 * @return {TableRow} The update table row
 */
TableService.prototype.updateTableRowForMatch = function(tableRow, score1, score2) {
	tableRow.matchesPlayed++;
	tableRow.goalsFor += score1;
	tableRow.goalsAgainst += score2;
	switch (this.compareGoals(score1, score2)) {
		case 1:
			tableRow.matchesWon++;
			tableRow.points += 3;
			break;
		case -1:
			tableRow.matchesLost++;
			break;
		case 0:
			tableRow.matchesDrawn++;
			tableRow.points += 1;
			break;
		default:
			break;
	}
	
	return tableRow;
};

/**
 * 
 * @param {array} tableRows
 * @returns {array}
 */
TableService.prototype.sortTable = function(tableRows) {
	var self = this;
	return tableRows.sort(function(tableRow1, tableRow2) {
		// compare points
		var result = self.comparePoints(tableRow1, tableRow2);
		if (result === 0) {
			
			// compare goal difference
			result = self.compareGoalDiff(tableRow1, tableRow2);
			if (result === 0) {
				
				// compare goals shot for
				result = self.compareGoalsFor(tableRow1, tableRow2);
				if (result === 0) {
					
					// compare direct matches
					result = self.compareDirectMatches(tableRow1.teamId, tableRow2.teamId);
					if (result === 0) {
						
						// compare shot away goals in direct matches
						result = self.compareShotAwayGoalsInDirectMatches(tableRow1.teamId, tableRow2.teamId);
						if (result === 0) {
							
							// compare shot away goals in all matches
							result = self.compareShotAwayGoalsInAllMatches(tableRow1.teamId, tableRow2.teamId);
						}
					}
				}
			}
		}
		
		return result; 
	}).reverse();
};

TableService.prototype.comparePoints = function(tableRow1, tableRow2) {
	if (tableRow1.points > tableRow2.points) {
		return 1;
	} else if (tableRow1.points < tableRow2.points) {
		return -1;
	}

	return 0;
};

/**
 * Compare the goal difference of two teams
 * 
 * @param {TableRow} tableRow1
 * @param {TableRow} tableRow2
 * @returns {Boolean}
 */
TableService.prototype.compareGoalDiff = function(tableRow1, tableRow2) {
	return this.compareGoals(tableRow1.goalDifference, tableRow2.goalDifference);
};

/**
 * Compare goals shot by each team
 * 
 * @param {TableRow} tableRow1
 * @param {TableRow} tableRow2
 * @returns {Boolean}
 */
TableService.prototype.compareGoalsFor = function(tableRow1, tableRow2) {
	return this.compareGoals(tableRow1.goalsFor, tableRow2.goalsFor);
};


/**
 * Compare the direct matches between two teams
 * 
 * @param {type} team1Id
 * @param {type} team2Id
 * @returns {Boolean}
 */
TableService.prototype.compareDirectMatches = function(team1Id, team2Id) {
	var team1TotalScore = 0;
	var team2TotalScore = 0;
	var homeMatchFound = false;
	var awayMatchFound = false;

	// find dircect matches
	this.matches.some(function (match) {
		// home game for team 1
		if (match.team1Id === team1Id && match.team2Id === team2Id) {
			team1TotalScore += match.scoreTeam1;
			team2TotalScore += match.scoreTeam2;
			homeMatchFound = true;
		}

		// away game for team 2
		if (match.team2Id === team1Id && match.team1Id === team2Id) {
			team1TotalScore += match.scoreTeam2;
			team2TotalScore += match.scoreTeam1;
			awayMatchFound = true;
		}

		// break when both matches are found
		if (homeMatchFound && awayMatchFound) {
			return true;
		}

		return false;
	});
	
	// team 1 won in direct comparision
	if (team1TotalScore > team2TotalScore) {
		return 1;
	}
	// team 1 lost in direct comparision
	else if (team1TotalScore < team2TotalScore) {
		return -1;
	}

	// team 1 and team 2 draw in direct comparison
	return 0;
};

/**
 * Compare the goals shot in away games in the matches between the
 * two team
 * 
 * @param {integer} team1Id
 * @param {integer} team1Id
 * @returns {Boolean}
 */
TableService.prototype.compareShotAwayGoalsInDirectMatches = function (team1Id, team2Id) {
	var homeMatch = null;
	var awayMatch = null;
	
	// find dircect matches
	this.matches.some(function (match) {
		if (match.team1Id === team1Id && match.team2Id === team2Id) {
			homeMatch = match;
		}
		
		if (match.team2Id === team1Id && match.team1Id === team2Id) {
			awayMatch = match;
		}
		
		// break when both matches are found
		if (homeMatch && awayMatch) {
			return true;
		}

		return false;
	});

	// team 1 shot more goals in away game
	if (awayMatch.scoreTeam2 > homeMatch.scoreTeam2) {
		return 1;
	}
	// team 2 shot more goals in away game
	else if (homeMatch.scoreTeam2 > awayMatch.scoreTeam2) {
		return -1;
	}

	// team 1 and team 2 shot the same number of goals in their away games
	return 0;
};

/**
 * Compares the goals shot in away matches
 * 
 * @param team1Id Main team ID
 * @param team2Id Team ID for the team to compare to
 * @returns boolean|null
 */
TableService.prototype.compareShotAwayGoalsInAllMatches = function (team1Id, team2Id) {
	var goalsTeam1 = 0;
	var goalsTeam2 = 0;

	this.matches.forEach(function (match) {
		switch (match.team2Id) {
			case team1Id:
				goalsTeam1 += match.scoreTeam2;
				break;
			case team2Id:
				goalsTeam2 += match.scoreTeam2;
				break;
			default:
				break;
		}
	});

	return this.compareGoals(goalsTeam1, goalsTeam2);
};

/**
 * Compares the goals shot by team1 and team2
 * 
 * @param goalsTeam1 Goals shot by team1
 * @param goalsTeam2 Golas shot by team2
 * @returns boolean|null
 */
TableService.prototype.compareGoals = function (goalsTeam1, goalsTeam2) {
	if (goalsTeam1 > goalsTeam2) {
		return 1;
	} else if (goalsTeam1 < goalsTeam2) {
		return -1;
	}

	return 0;
};

/**
 * Module exports
 */
module.exports = TableService;