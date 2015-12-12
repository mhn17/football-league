// DOM Ready ===================================================================
$(document).ready(function() {
	initShowMatchDay();
	initAddMatchDayModal();
	initAddMatchModal();
	initEditMatchModal();
});

// Functions ===================================================================
// match day
function initShowMatchDay() {
	// remove hidden class and hide using jquery
	$('.matchDayWrapper').removeClass('hidden').hide();
	
	// select last match day
	showLastMatchDay();
	
	// add onChange method
	$('#showMatchDay').on('change', function () {
		var selected = $(this).find('option:selected').val();
		$('.matchDayWrapper').hide();
		$('.matchDayWrapper.' + selected).show();
	});
};

function showLastMatchDay() {
	var value = $('#showMatchDay option:last-child').val();
	$('#showMatchDay option:last-child').attr('selected', 'selected');
	$('.matchDayWrapper.' + value).show();
};

function updateShowMatchDay() {
	$.ajax({
		type: 'GET',
		url: 'api/match-days',
		success: function (data) {
			var $showMatchDaySelect = $('#showMatchDay');
			$showMatchDaySelect.empty(); 
			$.each(data, function (index, matchDay) {
				$showMatchDaySelect.append($('<option></option>')
					.attr('value', matchDay.number).text(matchDay.number + 
						' (' + matchDay.dateFrom + ' - ' + matchDay.dateTo + ')'));
			});
			showLastMatchDay();
		},
		error: function () {
			$('#messageWrapper').html('<div class="alert alert-danger" role="alert">' +
				'<strong>Es ist ein Fehler aufgetreten. Die Spieltage wurden nicht aktualisiert!</strong>' +
				'</div>');
		}
	});
}

function initAddMatchDayModal() {
	$('#submitAddMatchDay').on('click', function() {
		$.ajax({
			type: 'POST',
			url: 'api/match-days',
			data: $('form#addMatchDayForm').serialize(),
			success: function (msg) {
				updateShowMatchDay();
				$('#addMatchDayModal').modal('hide');
				$('#messageWrapper').html('<div class="alert alert-success" role="alert">' +
					'<strong>Spieltag wurde gespeicher!</strong>' +
					'</div>');
			},
			error: function () {
				$('#addMatchDayModal').modal('hide');
				$('#messageWrapper').html('<div class="alert alert-danger" role="alert">' +
					'<strong>Es ist ein Fehler aufgetreten. Der Spieltag wurde nicht gespeichert!</strong>' +
					'</div>');
			}
		});
	});
}

// add match
function updateMatches() {
	var matchDayNumber = $('#showMatchDay :selected').val();
	$.ajax({
		type: 'GET',
		url: 'api/matches/match-day/' + matchDayNumber,
		success: function (data) {
			var $matchesTable = $('.matchDayWrapper.' + matchDayNumber + ' table tbody');
			$matchesTable.empty();
			$.each(data, function (index, match) {				
				$matchesTable.append('<tr class="tr-match-' + match.id + '" data-match-id="' + match.id + '">' +
						'<td class="match-date" data-match-date="' + $.format.date(match.date) + '">' + $.format.date(match.date, "dd.MM.yyyy") + '</td>' +
						'<td class="match-time">' + $.format.date(match.date, "hh:mm") + '</td>' +
						'<td class="match-team1">' + match.team1.name + '</td>' +
						'<td class="match-team2">' + match.team2.name + '</td>' +
						'<td class="match-score" data-match-score-team1="' + match.scoreTeam1 + '" data-match-score-team2="' + match.scoreTeam2 + '">' + match.scoreTeam1 + ':' + match.scoreTeam2 + '</td>' +
						'<td class="text-center">' +
							'<a href="#" data-match-id="' + match.id + '" class="editMatch" data-toggle="modal" data-target="#editMatchModal">' +
								'<span class="glyphicon glyphicon-pencil"></span>' +
							'</a>' +
						'</td>' +
					'<tr>');
			});
		}
	});
}

function initAddMatchModal() {
	$('#addMatchModal').on('shown.bs.modal', function (e) {
		// show and set match day
		$('#add-match-day-number-formatted').html($('#showMatchDay :selected').text());
		$('#add-match-day-number').val($('#showMatchDay :selected').val());
		
		// set teams
		$.ajax({
			type: 'GET',
			url: 'api/teams',
			success: function (data) {
				var $team1Select = $('#add-match-team1');
				var $team2Select = $('#add-match-team2');

				$.each(data, function (index, team) {
					$team1Select.append($('<option></option>')
						.attr('value', team.id).text(team.name));
					$team2Select.append($('<option></option>')
						.attr('value', team.id).text(team.name));
				});
			}
		});
	});
	
	$('#submitAddMatch').on('click', function () {
		$.ajax({
			type: 'POST',
			url: 'api/matches',
			data: $('form#addMatchForm').serialize(),
			success: function (msg) {
				updateMatches();
				$('#addMatchModal').modal('hide');
				$('#messageWrapper').html('<div class="alert alert-success" role="alert">' +
					'<strong>Spiel wurde gespeicher!</strong>' +
					'</div>');
			},
			error: function () {
				$('#addMatchModal').modal('hide');
				$('#messageWrapper').html('<div class="alert alert-danger" role="alert">' +
					'<strong>Es ist ein Fehler aufgetreten. Das Spiel wurde nicht gespeichert!</strong>' +
					'</div>');
			}
		});
	});
}

// edit match
function initEditMatchModal() {
	$('.editMatch').each(function() {
		$(this).on('click', function (e) {
			$('#editMatchModal').show();
		});
	});
	
	$('#editMatchModal').on('show.bs.modal', function (e) {
		var matchId = $(e.relatedTarget).attr('data-match-id');
		var date		= $('.tr-match-' + matchId + ' td.match-date').attr('data-match-date');
		var scoreTeam1	= $('.tr-match-' + matchId + ' td.match-score').attr('data-match-score-team1');
		var scoreTeam2	= $('.tr-match-' + matchId + ' td.match-score').attr('data-match-score-team2');

		// set match id
		$('#editMatchForm').attr('data-edit-match-id', matchId);

		// show match day
		$('#edit-match-day-number-formatted').html($('#showMatchDay :selected').text());
		$('#edit-match-day-number').val($('#showMatchDay :selected').val());

		// set date and time
		if (date.indexOf('Z') > 0) {
			$('#edit-match-date').val(date.substring(0, date.length - 5));
		}
		else {
			$('#edit-match-date').val(date.substring(0, date.length - 6));
		}

		// show teams
		$('#edit-match-team1').html($('.tr-match-' + matchId + ' td.match-team1').html());
		$('#edit-match-team2').html($('.tr-match-' + matchId + ' td.match-team2').html());

		// set scores
		$('#edit-match-scoreTeam1').val(scoreTeam1);
		$('#edit-match-scoreTeam2').val(scoreTeam2);
	});
	
	$('#submitEditMatch').on('click', function () {
		var form = $('form#editMatchForm');
		$.ajax({
			type: 'PUT',
			url: 'api/matches/' + form.attr('data-edit-match-id'),
			data: form.serialize(),
			success: function (msg) {
				updateMatches();
				$('#editMatchModal').modal('hide');
				$('#messageWrapper').html('<div class="alert alert-success" role="alert">' +
					'<strong>Spiel wurde gespeicher!</strong>' +
					'</div>');
			},
			error: function () {
				$('#editatchModal').modal('hide');
				$('#messageWrapper').html('<div class="alert alert-danger" role="alert">' +
					'<strong>Es ist ein Fehler aufgetreten. Das Spiel wurde nicht gespeichert!</strong>' +
					'</div>');
			}
		});
	});
}
