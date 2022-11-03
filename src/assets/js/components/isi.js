var isi = {
	init: function init(){
		isi.cE();
		isi.eL();
	},
	cE: function cE(){
		isi.isiFullWrapper 	= $('#isi__full');
		isi.openBtn					= $('#isi-btn');
		isi.openBtnText			= $(isi.openBtn).find('span');
		isi.openBtnImg			= $('.open-img');
		isi.closeBtnImg			= $('.close-img');
		isi.isiLink					= $('#isi-link');
	},
	eL: function eL(){
		$(isi.openBtn).on('click', function(e){
			e.preventDefault();
			isi.toggleIsi();
		});
		$(isi.isiLink).on('click', function(e){
			e.preventDefault();
			isi.toggleIsi();
		});
	},
	toggleIsi: function toggleIsi(){
		if ( $(isi.isiFullWrapper).hasClass('show-isi')){
			$(isi.isiFullWrapper).removeClass('show-isi');
			$(isi.openBtnText).text('Open');
			$(isi.closeBtnImg).addClass('hide');
			$(isi.openBtnImg).removeClass('hide');
			$(isi.isiFullWrapper).scrollTop(0);
		} else {
			$(isi.isiFullWrapper).addClass('show-isi');
			$(isi.openBtnText).text('Close');
			$(isi.closeBtnImg).removeClass('hide');
			$(isi.openBtnImg).addClass('hide');
		}
	}
};
