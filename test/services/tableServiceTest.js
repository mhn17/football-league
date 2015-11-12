/**
 * test/services/calcTablTest.js
 */

var assert = require('chai').assert;
var TableService = require('../../services/tableService');
var TableRow = require('../../services/tableRow');

describe('table service', function () {
	describe('#getCurrentTable', function () {
		it('should return an array with table entries with calculated rows in the right order', function () {
			assert.fail(false, true, "ToDo");
		});
	});

	describe('#calculateTableRow', function () {
		it('should return an array with a table row where teamId, teamName, matches played, won, ' +
			'drawn, lost, goals for, goals against, goal difference, points are set', function () {
				var matches = [
					{team1Id: 1, team2Id: 2, scoreTeam1: 0, scoreTeam2: 0},
					{team1Id: 2, team2Id: 3, scoreTeam1: 1, scoreTeam2: 0},
					{team1Id: 4, team2Id: 2, scoreTeam1: 2, scoreTeam2: 1},
					{team1Id: 2, team2Id: 5, scoreTeam1: 3, scoreTeam2: 2},
					{team1Id: 1, team2Id: 3, scoreTeam1: 0, scoreTeam2: 3},
					{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 0},
					{team1Id: 3, team2Id: 2, scoreTeam1: 2, scoreTeam2: 0},
					{team1Id: 2, team2Id: 4, scoreTeam1: 3, scoreTeam2: 1},
					{team1Id: 5, team2Id: 2, scoreTeam1: 0, scoreTeam2: 2},
					{team1Id: 3, team2Id: 1, scoreTeam1: 1, scoreTeam2: 3}
				];
				var tableService = new TableService(matches);
				var team = {
					"id": 2,
					"name": "teamName"
				};
				var tableRow = tableService.calculateTableRow(team);
				
				assert.equal(tableRow.teamId, 2, "team id should be 2");
				assert.equal(tableRow.teamName, "teamName", "team name should be teamName");
				assert.equal(tableRow.matchesPlayed, 8, "should be 8 matches played");
				assert.equal(tableRow.matchesWon, 5, "should be 5 matches won");
				assert.equal(tableRow.matchesDrawn, 1, "should be 1 matches drawn");
				assert.equal(tableRow.matchesLost, 2, "should be 2 matches lost");
				assert.equal(tableRow.goalsFor, 11, "should be 11 goals for");
				assert.equal(tableRow.goalsAgainst, 7, "should be 7 goals against");
				assert.equal(tableRow.goalDifference, 4, "should be 4 goal difference");
				assert.equal(tableRow.points, 16, "should be 16 points");
			});
	});

	describe('#sortTable', function () {
		it('should return an array with all table rows in the right order', function () {
			assert.fail(false, true, "ToDo");
		});

		describe('sorting helper functions', function () {
			describe('#comparePoints', function () {
				it('should return true if team1 has more points than team2', function () {
					assert.fail(false, true, "ToDo");
				});

				it('should return false if team1 has less points than team2', function () {
					assert.fail(false, true, "ToDo");
				});

				it('should return null if team1 has as many points as team2', function () {
					assert.fail(false, true, "ToDo");
				});
			});

			describe('#compareGoalDiff', function () {
				it('should return true if team1 has a bigger goal difference than team2', function () {
					assert.fail(false, true, "ToDo");
				});

				it('should return false if team1 has a smaller goal difference than team2', function () {
					assert.fail(false, true, "ToDo");
				});

				it('should return null if team1 has the same goal difference as team2', function () {
					assert.fail(false, true, "ToDo");
				});
			});

			describe('#compareGoalsFor', function () {
				it('should return true if team1 has shot more goals than team2', function () {
					assert.fail(false, true, "ToDo");
				});

				it('should return false if team1 has shot less goals than team2', function () {
					assert.fail(false, true, "ToDo");
				});

				it('should return null if team1 has shot as many goals as team2', function () {
					assert.fail(false, true, "ToDo");
				});
			});

			describe('#compareDirectMatches', function () {				
				describe('team1 has won in a combined result against team2', function () {
					it('should return true for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 3, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), true, "should be true");
					});

					it('should return true for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), true, "should be true");
					});
				});
				
				describe('team1 has lost in a combined result against team2', function () {
					it('should return false for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 3},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1}
						];
						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), false, "should be false");
					});
					
					it('should return false for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1}
						];
						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), false, "should be false");
					});
				});

				describe('team1 has drawn in a combined result against team2', function () {
					it('should return null for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 2, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1}
						];
						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), null, "should be null");
					});

					it('should return null for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 2, scoreTeam2: 1}
						];
						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), null, "should be null");
					});
				});
			});

			describe('#compareShotAwayGoalsInDirectMatches', function () {
				describe('team1 has shot more away goals against team2', function() {
					it('should return true for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 2}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), true, "should be true");
					});
					
					it('should return true for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 2},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), true, "should be true");
					});		
				});
				
				describe('team1 has shot less away goals than team2', function () {
					it('should return false for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 2, scoreTeam2: 2},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), false, "should be false");
					});

					it('should return false for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 2, scoreTeam2: 2}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), false, "should be false");
					});
				});
				
				describe('team1 has as many away goals as team2', function () {
					it('should return null for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), null, "should be null");
					});

					it('should return null for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), null, "should be null");
					});
				});
			});

			describe('#compareShotAwayGoalsInAllMatches', function () {
				it('should return true if team1 has shot more away goals in all matches than team2', function () {
					var matches = [
						{team1Id: 5, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
						{team1Id: 6, team2Id: 1, scoreTeam1: 1, scoreTeam2: 2},
						{team1Id: 7, team2Id: 1, scoreTeam1: 1, scoreTeam2: 3},
						{team1Id: 5, team2Id: 2, scoreTeam1: 0, scoreTeam2: 0},
						{team1Id: 6, team2Id: 2, scoreTeam1: 0, scoreTeam2: 1},
						{team1Id: 7, team2Id: 2, scoreTeam1: 0, scoreTeam2: 2}
					];
					var tableService = new TableService(matches);
					assert.equal(tableService.compareShotAwayGoalsInAllMatches(1, 2), true, "should be true");
				});

				it('should return false if team1 has shot less away goals in all matches than team2', function () {
					var matches = [
						{team1Id: 5, team2Id: 1, scoreTeam1: 0, scoreTeam2: 0},
						{team1Id: 6, team2Id: 1, scoreTeam1: 0, scoreTeam2: 1},
						{team1Id: 7, team2Id: 1, scoreTeam1: 0, scoreTeam2: 2},
						{team1Id: 5, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1},
						{team1Id: 6, team2Id: 2, scoreTeam1: 1, scoreTeam2: 2},
						{team1Id: 7, team2Id: 2, scoreTeam1: 1, scoreTeam2: 3}
					];
					var tableService = new TableService(matches);
					assert.equal(tableService.compareShotAwayGoalsInAllMatches(1, 2), false, "should be false");
				});

				it('should return null if team1 has shot as many away goals as team2', function () {
					var matches = [
						{team1Id: 5, team2Id: 1, scoreTeam1: 0, scoreTeam2: 1},
						{team1Id: 6, team2Id: 1, scoreTeam1: 0, scoreTeam2: 1},
						{team1Id: 7, team2Id: 1, scoreTeam1: 0, scoreTeam2: 1},
						{team1Id: 5, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1},
						{team1Id: 6, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1},
						{team1Id: 7, team2Id: 2, scoreTeam1: 0, scoreTeam2: 1}
					];
					var tableService = new TableService(matches);
					assert.equal(tableService.compareShotAwayGoalsInAllMatches(1, 2), null, "should be null");
				});
			});

			describe('#compareGoals', function () {
				it('should return true if team1 has shot more goals than team2', function () {
					var tableService = new TableService();
					assert.equal(tableService.compareGoals(2, 1), true, "should be true");
				});

				it('should return false if team1 has shot less goals than team2', function () {
					var tableService = new TableService();
					assert.equal(tableService.compareGoals(1, 2), false, "should be false");
				});

				it('should return null if team1 has shot as many goals as team2', function () {
					var tableService = new TableService();
					assert.equal(tableService.compareGoals(1, 1), null, "should be null");
				});
			});
		});
	});
});