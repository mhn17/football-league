// DOM Ready ===================================================================
$(document).ready(function() {
	initShowMatchDay();
});

// Functions ===================================================================
function initShowMatchDay() {
	$('#showMatchDay').on('change', function () {
		var selected = $(this).find("option:selected").val();
		$('.matchDayWrapper').removeClass('hidden').hide();
		$('.matchDayWrapper.' + selected).show();
	});

};
