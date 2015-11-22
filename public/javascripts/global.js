// DOM Ready ===================================================================
$(document).ready(function() {
	initShowMatchDay();
});

// Functions ===================================================================
function initShowMatchDay() {
	// remove hidden class and hide using jquery
	$('.matchDayWrapper').removeClass('hidden').hide();
	
	// select last match day
	var value = $('#showMatchDay option:last-child').val();
	$('#showMatchDay option:last-child').attr('selected', 'selected');	
	$('.matchDayWrapper.' + value).show();
	
	// add onChange method
	$('#showMatchDay').on('change', function () {
		var selected = $(this).find("option:selected").val();
		$('.matchDayWrapper').hide();
		$('.matchDayWrapper.' + selected).show();
	});

};
