/**
 * test/services/calcTablTest.js
 */

var assert = require('chai').assert;
var TableService = require('../../services/tableService');
var TableRow = require('../../services/tableRow');

describe('table service', function () {
	describe('#getCurrentTable', function () {
		it('should return an array with table entries with calculated rows in the right order', function () {
			var matches = [
				{team1Id: 1, team2Id: 3, scoreTeam1: 1, scoreTeam2: 1},
				{team1Id: 3, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
				{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
				{team1Id: 2, team2Id: 3, scoreTeam1: 1, scoreTeam2: 2}
			];
			
			var teams = [
				{id: 1},
				{id: 2},
				{id: 3}
			];

			var tableService = new TableService(matches, teams);
			var table = tableService.getCurrentTable();

			assert(table[0].teamId === 3, "team 3 should be first");
			assert(table[1].teamId === 1, "team 1 should be second");
			assert(table[2].teamId === 2, "team 2 should be third");
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
		describe('sort function', function () {
			it('should return the right order for points comparison', function() {
				var tableRows = [
					{teamId: 1, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 12},
					{teamId: 2, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 9},
					{teamId: 3, goalsFor: 5, goalsAgainst: 0, goalDifference: 5, points: 15}
				];
				
				var tableService = new TableService([]);
				var table = tableService.sortTable(tableRows);

				assert(table[0].teamId === 3, "team 3 should be first");
				assert(table[1].teamId === 1, "team 1 should be second");
				assert(table[2].teamId === 2, "team 2 should be third");
			});
			
			it('should return the right order for goal difference comparison', function () {
				var tableRows = [
					{teamId: 2, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 9},
					{teamId: 3, goalsFor: 5, goalsAgainst: 0, goalDifference: 5, points: 15},
					{teamId: 1, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 15}
				];

				var tableService = new TableService([]);
				var table = tableService.sortTable(tableRows);

				assert(table[0].teamId === 3, "team 3 should be first");
				assert(table[1].teamId === 1, "team 1 should be second");
				assert(table[2].teamId === 2, "team 2 should be third");
			});

			it('should return the right order for shot goals for', function () {
				var tableRows = [
					{teamId: 2, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 9},
					{teamId: 3, goalsFor: 5, goalsAgainst: 2, goalDifference: 3, points: 15},
					{teamId: 1, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 15}
				];

				var tableService = new TableService([]);
				var table = tableService.sortTable(tableRows);

				assert(table[0].teamId === 3, "team 3 should be first");
				assert(table[1].teamId === 1, "team 1 should be second");
				assert(table[2].teamId === 2, "team 2 should be third");
			});

			it('should return the right order for direct match comparisson', function () {
				var tableRows = [
					{teamId: 2, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 9},
					{teamId: 3, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 15},
					{teamId: 1, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 15}
				];
				
				var matches = [
					{team1Id: 1, team2Id: 3, scoreTeam1: 1, scoreTeam2: 2},
					{team1Id: 3, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
					{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1}
				];

				var tableService = new TableService(matches);
				var table = tableService.sortTable(tableRows);

				assert(table[0].teamId === 3, "team 3 should be first");
				assert(table[1].teamId === 1, "team 1 should be second");
				assert(table[2].teamId === 2, "team 2 should be third");
			});

			it('should return the right order for shot goals away in direct matches', function () {
				var tableRows = [
					{teamId: 2, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 9},
					{teamId: 3, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 15},
					{teamId: 1, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 15}
				];

				var matches = [
					{team1Id: 1, team2Id: 3, scoreTeam1: 2, scoreTeam2: 2},
					{team1Id: 3, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
					{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1}
				];

				var tableService = new TableService(matches);
				var table = tableService.sortTable(tableRows);

				assert(table[0].teamId === 3, "team 3 should be first");
				assert(table[1].teamId === 1, "team 1 should be second");
				assert(table[2].teamId === 2, "team 2 should be third");
			});

			it('should return the right order for shot goals away in all matches', function () {
				var tableRows = [
					{teamId: 2, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 9},
					{teamId: 3, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 15},
					{teamId: 1, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 15}
				];

				var matches = [
					{team1Id: 1, team2Id: 3, scoreTeam1: 1, scoreTeam2: 1},
					{team1Id: 3, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
					{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
					{team1Id: 2, team2Id: 3, scoreTeam1: 1, scoreTeam2: 2}
				];

				var tableService = new TableService(matches);
				var table = tableService.sortTable(tableRows);

				assert(table[0].teamId === 3, "team 3 should be first");
				assert(table[1].teamId === 1, "team 1 should be second");
				assert(table[2].teamId === 2, "team 2 should be third");
			});

			it('should return the right order for no criteria match', function () {
				var tableRows = [
					{teamId: 2, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 9},
					{teamId: 1, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 15},
					{teamId: 3, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 15}
				];

				var matches = [
					{team1Id: 1, team2Id: 3, scoreTeam1: 1, scoreTeam2: 1},
					{team1Id: 3, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
					{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
					{team1Id: 2, team2Id: 3, scoreTeam1: 1, scoreTeam2: 1}
				];

				var tableService = new TableService(matches);
				var table = tableService.sortTable(tableRows);

				assert(table[0].teamId === 3, "team 3 should be first");
				assert(table[1].teamId === 1, "team 1 should be second");
				assert(table[2].teamId === 2, "team 2 should be third");
			});
		});

		describe('sorting helper functions', function () {
			describe('#comparePoints', function () {
				it('should return 1 if team1 has more points than team2', function () {
					var tableRow1 = new TableRow();
					tableRow1.points = 2;

					var tableRow2 = new TableRow();
					tableRow2.points = 1;

					var tableService = new TableService([]);
					assert.equal(tableService.comparePoints(tableRow1, tableRow2), 1, "should be 1");
				});

				it('should return -1 if team1 has less points than team2', function () {
					var tableRow1 = new TableRow();
					tableRow1.points = 1;

					var tableRow2 = new TableRow();
					tableRow2.points = 2;

					var tableService = new TableService([]);
					assert.equal(tableService.comparePoints(tableRow1, tableRow2), -1, "should be -1");
				});

				it('should return 0 if team1 has as many points as team2', function () {
					var tableRow1 = new TableRow();
					tableRow1.points = 1;

					var tableRow2 = new TableRow();
					tableRow2.points = 1;

					var tableService = new TableService([]);
					assert.equal(tableService.comparePoints(tableRow1, tableRow2), 0, "should be 0");
				});
			});

			describe('#compareGoalDiff', function () {
				it('should return 1 if team1 has a bigger goal difference than team2', function () {
					var tableRow1 = new TableRow();
					tableRow1.goalDifference = 2;

					var tableRow2 = new TableRow();
					tableRow2.goalDifference = 1;

					var tableService = new TableService([]);
					assert.equal(tableService.compareGoalDiff(tableRow1, tableRow2), 1, "should be 1");
				});

				it('should return -1 if team1 has a smaller goal difference than team2', function () {
					var tableRow1 = new TableRow();
					tableRow1.goalDifference = 1;

					var tableRow2 = new TableRow();
					tableRow2.goalDifference = 2;

					var tableService = new TableService([]);
					assert.equal(tableService.compareGoalDiff(tableRow1, tableRow2), -1, "should be -1");
				});

				it('should return 0 if team1 has the same goal difference as team2', function () {
					var tableRow1 = new TableRow();
					tableRow1.goalDifference = 1;

					var tableRow2 = new TableRow();
					tableRow2.goalDifference = 1;

					var tableService = new TableService([]);
					assert.equal(tableService.compareGoalDiff(tableRow1, tableRow2), 0, "should be 0");
				});
			});

			describe('#compareGoalsFor', function () {
				it('should return 1 if team1 has shot more goals than team2', function () {
					var tableRow1 = new TableRow();
					tableRow1.goalsFor = 2;
					
					var tableRow2 = new TableRow();
					tableRow2.goalsFor = 1;
					
					var tableService = new TableService([]);
					assert.equal(tableService.compareGoalsFor(tableRow1, tableRow2), 1, "should be 1");
				});

				it('should return -1 if team1 has shot less goals than team2', function () {
					var tableRow1 = new TableRow();
					tableRow1.goalsFor = 1;

					var tableRow2 = new TableRow();
					tableRow2.goalsFor = 2;

					var tableService = new TableService([]);
					assert.equal(tableService.compareGoalsFor(tableRow1, tableRow2), -1, "should be -1");
				});

				it('should return 0 if team1 has shot as many goals as team2', function () {
					var tableRow1 = new TableRow();
					tableRow1.goalsFor = 1;

					var tableRow2 = new TableRow();
					tableRow2.goalsFor = 1;

					var tableService = new TableService([]);
					assert.equal(tableService.compareGoalsFor(tableRow1, tableRow2), 0, "should be 0");
				});
			});

			describe('#compareDirectMatches', function () {				
				describe('team1 has won in a combined result against team2', function () {
					it('should return 1 for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 3, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), 1, "should be 1");
					});

					it('should return 1 for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), 1, "should be 1");
					});
				});
				
				describe('team1 has lost in a combined result against team2', function () {
					it('should return -1 for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 3},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1}
						];
						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), -1, "should be -1");
					});
					
					it('should return -1 for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1}
						];
						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), -1, "should be -1");
					});
				});

				describe('team1 has drawn in a combined result against team2', function () {
					it('should return 0 for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 2, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1}
						];
						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), 0, "should be 0");
					});

					it('should return 0 for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 2, scoreTeam2: 1}
						];
						var tableService = new TableService(matches);
						assert.equal(tableService.compareDirectMatches(1, 2), 0, "should be 0");
					});
				});
			});

			describe('#compareShotAwayGoalsInDirectMatches', function () {
				describe('team1 has shot more away goals against team2', function() {
					it('should return 1 for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 2}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), 1, "should be 1");
					});
					
					it('should return 1 for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 2, scoreTeam2: 2},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), 1, "should be 1");
					});		
				});
				
				describe('team1 has shot less away goals than team2', function () {
					it('should return -1 for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 2, scoreTeam2: 2},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), -1, "should be -1");
					});

					it('should return -1 for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 2, scoreTeam2: 2}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), -1, "should be -1");
					});
				});
				
				describe('team1 has as many away goals as team2', function () {
					it('should return 0 for home game first for team1', function () {
						var matches = [
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), 0, "should be 0");
					});

					it('should return 0 for away game first for team1', function () {
						var matches = [
							{team1Id: 2, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
							{team1Id: 6, team2Id: 7, scoreTeam1: 1, scoreTeam2: 2},
							{team1Id: 1, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1}
						];

						var tableService = new TableService(matches);
						assert.equal(tableService.compareShotAwayGoalsInDirectMatches(1, 2), 0, "should be 0");
					});
				});
			});

			describe('#compareShotAwayGoalsInAllMatches', function () {
				it('should return 1 if team1 has shot more away goals in all matches than team2', function () {
					var matches = [
						{team1Id: 5, team2Id: 1, scoreTeam1: 1, scoreTeam2: 1},
						{team1Id: 6, team2Id: 1, scoreTeam1: 1, scoreTeam2: 2},
						{team1Id: 7, team2Id: 1, scoreTeam1: 1, scoreTeam2: 3},
						{team1Id: 5, team2Id: 2, scoreTeam1: 0, scoreTeam2: 0},
						{team1Id: 6, team2Id: 2, scoreTeam1: 0, scoreTeam2: 1},
						{team1Id: 7, team2Id: 2, scoreTeam1: 0, scoreTeam2: 2}
					];
					var tableService = new TableService(matches);
					assert.equal(tableService.compareShotAwayGoalsInAllMatches(1, 2), 1, "should be 1");
				});

				it('should return -1 if team1 has shot less away goals in all matches than team2', function () {
					var matches = [
						{team1Id: 5, team2Id: 1, scoreTeam1: 0, scoreTeam2: 0},
						{team1Id: 6, team2Id: 1, scoreTeam1: 0, scoreTeam2: 1},
						{team1Id: 7, team2Id: 1, scoreTeam1: 0, scoreTeam2: 2},
						{team1Id: 5, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1},
						{team1Id: 6, team2Id: 2, scoreTeam1: 1, scoreTeam2: 2},
						{team1Id: 7, team2Id: 2, scoreTeam1: 1, scoreTeam2: 3}
					];
					var tableService = new TableService(matches);
					assert.equal(tableService.compareShotAwayGoalsInAllMatches(1, 2), -1, "should be -1");
				});

				it('should return 0 if team1 has shot as many away goals as team2', function () {
					var matches = [
						{team1Id: 5, team2Id: 1, scoreTeam1: 0, scoreTeam2: 1},
						{team1Id: 6, team2Id: 1, scoreTeam1: 0, scoreTeam2: 1},
						{team1Id: 7, team2Id: 1, scoreTeam1: 0, scoreTeam2: 1},
						{team1Id: 5, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1},
						{team1Id: 6, team2Id: 2, scoreTeam1: 1, scoreTeam2: 1},
						{team1Id: 7, team2Id: 2, scoreTeam1: 0, scoreTeam2: 1}
					];
					var tableService = new TableService(matches);
					assert.equal(tableService.compareShotAwayGoalsInAllMatches(1, 2), 0, "should be 0");
				});
			});

			describe('#compareGoals', function () {
				it('should return 1 if team1 has shot more goals than team2', function () {
					var tableService = new TableService();
					assert.equal(tableService.compareGoals(2, 1), 1, "should be 1");
				});

				it('should return -1 if team1 has shot less goals than team2', function () {
					var tableService = new TableService();
					assert.equal(tableService.compareGoals(1, 2), -1, "should be -1");
				});

				it('should return 0 if team1 has shot as many goals as team2', function () {
					var tableService = new TableService();
					assert.equal(tableService.compareGoals(1, 1), 0, "should be 0");
				});
			});
		});
	});
});