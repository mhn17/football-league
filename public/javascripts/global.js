// DOM Ready ===================================================================
$(document).ready(function() {
	initShowMatchDay();
	initAddMatchDayModal();
	initAddMatchModal();
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
				$matchesTable.append('<tr>' +
						'<td>' + $.format.date(match.date, "dd.MM.yyyy") + '</td>' +
						'<td>' + match.team1.name + '</td>' +
						'<td>' + match.team2.name + '</td>' +
						'<td>' + match.scoreTeam1 + ':' + match.scoreTeam2 + '</td>' +
					'<tr>');
			});
		}
	});
}

function initAddMatchModal() {
	$('#addMatchModal').on('shown.bs.modal', function (e) {
		// show and set match day
		$('#match-day-number-formatted').html($('#showMatchDay :selected').text());
		$('#match-day-number').val($('#showMatchDay :selected').val());
		
		// set teams
		$.ajax({
			type: 'GET',
			url: 'api/teams',
			success: function (data) {
				var $team1Select = $('#match-team1');
				var $team2Select = $('#match-team2');

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