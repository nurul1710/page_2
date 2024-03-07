/* This file contains main script for website
 * Style related scripts is located in style.js
 */
/* global document jQuery */

// initialize when document is ready
jQuery(document).ready(function($) {

	// initialize magnificPopup
	var mfpLink = $('.js-mfp-link').magnificPopup({
		type: 'inline',
		mainClass: 'mfp-animation',
		removalDelay: 200,
		showCloseBtn: false
	});

	$('.mfp-inline .close').on('click', function(event) {
		mfpLink.magnificPopup('close');
		event.preventDefault();
	});

	$('.js-mfp-gallery').on('click', function(event) {
		var link = $(this).attr('href');

		$(link).magnificPopup({
			delegate: 'a',
			type: 'image',
			mainClass: 'mfp-animation',
			preloader: false,
			removalDelay: 200,
			image: {
				titleSrc: function(item) {
					return item.el.attr('title');
				}
			},
			gallery: {
				enabled: true,
				arrowMarkup: '<button title="%title%" type="button" class="popup-arrow popup-arrow-%dir%"></button>',
				navigateByImgClick: true,
				preload: [0,1]
			}
		}).magnificPopup('open');

		event.preventDefault();
	});

	// initialize flickity
	$('.js-flickity-carousel').flickity({
		cellAlign: 'left',
		contain: true,
		imagesLoaded: true,
		groupCells: true,
		prevNextButtons: false,
		wrapAround: false
	});

	equalheight('.js-resto-post-items .resto-post-item');
	equalheight('.js-resto-gallery-items .resto-gallery-item');

	// initialize spinner
	$('.js-form-input-spinner').spinner();

	// TOMMY
	$('.help-item-tab').on('click', function() {
		var $parent = $(this).parent('.help-item'),
			$desc = $parent.find('.help-item-desc');

		if($parent.hasClass('is-toggled')) {
			$parent.removeClass('is-toggled');
			$desc.slideUp(200);
		}
		else {
			$parent.addClass('is-toggled');
			$desc.slideDown(200);
		}
	});

});
