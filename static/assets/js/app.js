
$(function () {
	"use strict";
	/* perfect scrol bar */
	//new PerfectScrollbar('.header-message-list');
	//new PerfectScrollbar('.header-notifications-list');
	// search bar
	$(".mobile-search-icon").on("click", function () {
		$(".search-bar").addClass("full-search-bar");
		$(".page-wrapper").addClass("search-overlay");
	});
	$(".search-close").on("click", function () {
		$(".search-bar").removeClass("full-search-bar");
		$(".page-wrapper").removeClass("search-overlay");
	});
	$(".mobile-toggle-menu").on("click", function () {
		$(".wrapper").addClass("toggled");
	});
	// toggle menu button
	$(".toggle-icon").click(function () {
		// if ($(".wrapper").hasClass("toggled")) {
		// 	// unpin sidebar when hovered
		// 	$(".wrapper").removeClass("toggled");
		// 	$(".sidebar-wrapper").unbind("hover");
		// } else {
		// 	$(".wrapper").addClass("toggled");
		// 	$(".sidebar-wrapper").hover(function () {
		// 		$(".wrapper").addClass("sidebar-hovered");
		// 	}, function () {
		// 		$(".wrapper").removeClass("sidebar-hovered");
		// 	})
		// }
	});
	$('.navbar-item-body').hover(
		function() {
			$(this).prev().find('.navbar-item-prev').addClass("navbar-item-prev-hover");
			$(this).next().find('.navbar-item-prev').addClass("navbar-item-after-hover");
			$(this).find('.navbar-item-icon').addClass("navbar-item-icon-hover");
			$(this).find('.navbar-item-content').addClass("navbar-item-content-hover");
			$(this).addClass("navbar-item-body-hover");
		},
		function() {
			if ($(this).attr('href') != window.location.pathname)
			{
				$(this).prev().find('.navbar-item-prev').removeClass("navbar-item-prev-hover");
				$(this).next().find('.navbar-item-prev').removeClass("navbar-item-after-hover");
				$(this).find('.navbar-item-icon').removeClass("navbar-item-icon-hover");
				$(this).find('.navbar-item-content').removeClass("navbar-item-content-hover");
				$(this).removeClass("navbar-item-body-hover");
			}
		}
	  );
	$(".toggle-icon-show").click(function () {
		$(".toggle-icon-hide").show();
		$(".toggle-icon-show").hide();
		$(".logo-text").show();
		$(".navbar-item-content").show();
		$(".sidebar-wrapper").removeClass("sidebar-wrapper-mini");
		$(".sidebar-header").removeClass("sidebar-header-mini");
		$(".page-wrapper").removeClass("page-wrapper-mini");
		$(".topbar").removeClass("topbar-mini");

	});
	$(".toggle-icon-hide").click(function () {
		$(".toggle-icon-hide").hide();
		$(".toggle-icon-show").show();
		$(".logo-text").hide();
		$(".navbar-item-content").hide();
		$(".sidebar-wrapper").addClass("sidebar-wrapper-mini");
		$(".sidebar-header").addClass("sidebar-header-mini");
		$(".page-wrapper").addClass("page-wrapper-mini");
		$(".topbar").addClass("topbar-mini");
	});
	/* Back To Top */
	$(document).ready(function () {
		
		$(window).on("scroll", function () {
			if ($(this).scrollTop() > 300) {
				$('.back-to-top').fadeIn();
			} else {
				$('.back-to-top').fadeOut();
			}
		});
		$('.back-to-top').on("click", function () {
			$("html, body").animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	});
	// === sidebar menu activation js
	
	$(function () {
		let o= $(".navbar-item-body").filter(function () {
			return this.href == window.location.href;
		})
		console.log(o);
		console.log(window.location);
		o.prev().find('.navbar-item-prev').addClass("navbar-item-prev-hover");
		o.next().find('.navbar-item-prev').addClass("navbar-item-after-hover");
		o.find('.navbar-item-icon').addClass("navbar-item-icon-hover");
		o.find('.navbar-item-content').addClass("navbar-item-content-hover");
		o.addClass("navbar-item-body-hover");
	});
	
	// metismenu
	$(function () {
		$('#menu').metisMenu();
	});
	// chat toggle
	$(".chat-toggle-btn").on("click", function () {
		$(".chat-wrapper").toggleClass("chat-toggled");
	});
	$(".chat-toggle-btn-mobile").on("click", function () {
		$(".chat-wrapper").removeClass("chat-toggled");
	});
	// email toggle
	$(".email-toggle-btn").on("click", function () {
		$(".email-wrapper").toggleClass("email-toggled");
	});
	$(".email-toggle-btn-mobile").on("click", function () {
		$(".email-wrapper").removeClass("email-toggled");
	});
	// compose mail
	$(".compose-mail-btn").on("click", function () {
		$(".compose-mail-popup").show();
	});
	$(".compose-mail-close").on("click", function () {
		$(".compose-mail-popup").hide();
	});
	/*switcher*/
	$(".switcher-btn").on("click", function () {
		$(".switcher-wrapper").toggleClass("switcher-toggled");
	});
	$(".close-switcher").on("click", function () {
		$(".switcher-wrapper").removeClass("switcher-toggled");
	});
	$("#lightmode").on("click", function () {
		$('html').attr('class', 'light-theme');
	});
	$("#darkmode").on("click", function () {
		$('html').attr('class', 'dark-theme');
	});
	$("#semidark").on("click", function () {
		$('html').attr('class', 'semi-dark');
	});
	$("#minimaltheme").on("click", function () {
		$('html').attr('class', 'minimal-theme');
	});
	$("#headercolor1").on("click", function () {
		$("html").addClass("color-header headercolor1");
		$("html").removeClass("headercolor2 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8");
	});
	$("#headercolor2").on("click", function () {
		$("html").addClass("color-header headercolor2");
		$("html").removeClass("headercolor1 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8");
	});
	$("#headercolor3").on("click", function () {
		$("html").addClass("color-header headercolor3");
		$("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8");
	});
	$("#headercolor4").on("click", function () {
		$("html").addClass("color-header headercolor4");
		$("html").removeClass("headercolor1 headercolor2 headercolor3 headercolor5 headercolor6 headercolor7 headercolor8");
	});
	$("#headercolor5").on("click", function () {
		$("html").addClass("color-header headercolor5");
		$("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor3 headercolor6 headercolor7 headercolor8");
	});
	$("#headercolor6").on("click", function () {
		$("html").addClass("color-header headercolor6");
		$("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor3 headercolor7 headercolor8");
	});
	$("#headercolor7").on("click", function () {
		$("html").addClass("color-header headercolor7");
		$("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor3 headercolor8");
	});
	$("#headercolor8").on("click", function () {
		$("html").addClass("color-header headercolor8");
		$("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor3");
	});
	
	
	
   // sidebar colors 


    $('#sidebarcolor1').click(theme1);
    $('#sidebarcolor2').click(theme2);
    $('#sidebarcolor3').click(theme3);
    $('#sidebarcolor4').click(theme4);
    $('#sidebarcolor5').click(theme5);
    $('#sidebarcolor6').click(theme6);
    $('#sidebarcolor7').click(theme7);
    $('#sidebarcolor8').click(theme8);

    function theme1() {
      $('html').attr('class', 'color-sidebar sidebarcolor1');
    }

    function theme2() {
      $('html').attr('class', 'color-sidebar sidebarcolor2');
    }

    function theme3() {
      $('html').attr('class', 'color-sidebar sidebarcolor3');
    }

    function theme4() {
      $('html').attr('class', 'color-sidebar sidebarcolor4');
    }
	
	function theme5() {
      $('html').attr('class', 'color-sidebar sidebarcolor5');
    }
	
	function theme6() {
      $('html').attr('class', 'color-sidebar sidebarcolor6');
    }

    function theme7() {
      $('html').attr('class', 'color-sidebar sidebarcolor7');
    }

    function theme8() {
      $('html').attr('class', 'color-sidebar sidebarcolor8');
    }

});

var getCookie = getCookie;

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

var confirmToast = confirmToast;
function confirmToast(message, callbackOk, callbackNo)
{
	toastr.options = {
		"closeButton": true,
		"positionClass": "toast-top-right",
		"timeOut": "0",
		"extendedTimeOut": "0",
		"tapToDismiss": true,
		"onShown": function() {
		  $("#toastr-confirm-btn").click(callbackOk);
		  $("#toastr-cancel-btn").click(callbackNo);
		}
	  }
	toastr.info('<button id="toastr-confirm-btn" class="btn btn-success" style="width:100px">Ok</button> <button id="toastr-cancel-btn" class="btn btn-danger" style="width:100px">Cancel</button>', message);
	
}
