/**
 * services/tableService.js
 */


/**
 * 
 * @param {type} matches All matches
 * @returns {nm$_tableService.TableService}
 */
function TableService(matches) {
	this.matches = matches;
}

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
		return true;
	}
	// team 1 lost in direct comparision
	else if (team1TotalScore < team2TotalScore) {
		return false;
	}

	// team 1 and team 2 draw in direct comparison
	return null;
};

/**
 * Compare the goals shot in away games in the matches between the
 * two team
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
		return true;
	}
	// team 2 shot more goals in away game
	else if (homeMatch.scoreTeam2 > awayMatch.scoreTeam2) {
		return false;
	}

	// team 1 and team 2 shot the same number of goals in their away games
	return null;
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
		return true;
	} else if (goalsTeam1 < goalsTeam2) {
		return false;
	}

	return null;
};

/**
 * Module exports
 */
module.exports = TableService;