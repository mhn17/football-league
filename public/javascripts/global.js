// DOM Ready ===================================================================
$(document).ready(function() {
	initShowMatchDay();
	initAddMatchDayModal();
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
		var selected = $(this).find("option:selected").val();
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
			var $showMatchDaySelect = $("#showMatchDay");
			$showMatchDaySelect.empty(); 
			$.each(data, function (index, matchDay) {
				$showMatchDaySelect.append($("<option></option>")
					.attr("value", matchDay.number).text(matchDay.number + 
						" (" + matchDay.dateFrom + " - " + matchDay.dateTo + ")"));
			});
			showLastMatchDay();
		},
		error: function () {
			$("#messageWrapper").html('<div class="alert alert-danger" role="alert">' +
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
				$("#addMatchDayModal").modal('hide');
				$("#messageWrapper").html('<div class="alert alert-success" role="alert">' +
					'<strong>Spieltag wurde gespeicher!</strong>' +
					'</div>');
			},
			error: function () {
				$("#addMatchDayModal").modal('hide');
				$("#messageWrapper").html('<div class="alert alert-danger" role="alert">' +
					'<strong>Es ist ein Fehler aufgetreten. Der Spieltag wurde nicht gespeichert!</strong>' +
					'</div>');
			}
		});
	});
}