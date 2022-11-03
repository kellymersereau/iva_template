var global = {
	init: function init(){
		// Let's keep it strict
		'use strict';
		global.cE();
		global.eL();
	},
	cE: function cE(){
		global.navLinks     = $('.nav-link');
		global.slideLinks   = {
			'cover': 'overview_cover_slide_2021.zip',
			'cover-v2': 'overview_cover_slide_2021_v2.zip',
			'benefits': 'overview_livalo_benefits_slide_2021.zip',
			'ten-reasons': 'overview_ten-reasons_slide_2021.zip',
			'competitor-summaries': 'overview_competitor-summaries_slide_2021.zip'
		};
	},
	eL: function eL(){

		$('.scroll').on("touchmove", function(event) {
			event.stopPropagation();
		});

		/*
		 * Navigation Links
		 */
		$.each(global.navLinks, function(i){
			$(global.navLinks[i]).on('click', function(e){
				e.preventDefault();
				var slide = $(this).data('slide');
				com.veeva.clm.gotoSlide(global.slideLinks[slide], 'THIS_IVA');
				console.log('clicked to go to slide '+global.slideLinks[slide]);
			});
		});
	}
};
