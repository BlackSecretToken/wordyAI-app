
$(document).ready(function () {
	
	initSidebar();
	menu();
});
function initSidebar (){
	for (var i = window.location, o = $(".metismenu li a").filter(function () {
		return this.href == i;
	}).addClass("").parent().addClass("mm-active");;) {
		if (!o.is("li")) break;
		o = o.parent("").addClass("mm-show").parent("").addClass("mm-active");
	}
};
function menu() {
	$('#menu').metisMenu();
};