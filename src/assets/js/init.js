iva = {
	init: function (){
		
		// Initiate Global JS functionality
		global.init();
		// Initiate ISI JS functionality
		isi.init();
		// Initiate Modals JS functionality
		modals.init();
		if ($('main').hasClass('tabbed-slide')){
			tabs.init();
		}
	}
};

iva.init();
