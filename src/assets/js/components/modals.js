var modals = {
	init: function init(){
		modals.cE();
		modals.eL();
	},
	cE: function cE(){
		modals.modalLinks               = $('.modal-link');
		modals.closeLink                = $('.close');
	},
	eL: function eL(){
		/*
				Close button on modals
		 */
		modals.closeLink.on('click', function(e) {
			e.preventDefault();
			$('#overlay').removeClass('show');
			$('.modal').removeClass('show');
			if(($('.modal').hasClass('video-1')) && ($('video')[0].currentTime > 0)){
				$('video')[0].pause();
				$('video')[0].currentTime = 0;
				$('video')[0].load();
			}
			$('.close').removeClass('show');
			$('body').removeClass('disable');
			$('.content').scrollTop(0);
		});
		/*
				Modal links
		 */
		$.each(modals.modalLinks, function(i){
			$(modals.modalLinks[i]).on('click', function(e){
				e.preventDefault();
				var modalId = $(this).data('overlay');
				$('#overlay').addClass('show');
				$('.modal.'+modalId).addClass('show');
				$('.modal.'+modalId).find('.close').addClass('show');
				
				if(modalId === 'video-1'){
					$('.modal.video-1 video')[0].play();
				}
			});
		});
	},
	addToClickStream: function addToClickStream(eventName, eventType, eventId){
		var streamObj = {};
		streamObj.Track_Element_Id_vod__c = eventId;
		streamObj.Track_Element_Description_vod__c = eventName;
		streamObj.Track_Element_Type_vod__c = eventType;
		
		try {
			com.veeva.clm.createRecord("Call_Clickstream_vod__c", streamObj, modals.clickstreamCallback);
		} catch (e) {
			// alert(e);
			console.log(e);
		}
	},
	clickstreamCallback: function clickstreamCallback(){
		// result is a json object passed in by iRep media player
		console.log( JSON.stringify(result) );
		if (!result.success) {
			// alert(result.message);
			console.log(result.message);
		}
	}
};
