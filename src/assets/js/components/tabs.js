var tabs = {
  init: function init(){
    tabs.cE();
    tabs.eL();
  },
  cE: function cE(){
    tabs.tabLink    = $('.tab-links');
    tabs.tabContent = $('.tab-content');
  },
  eL: function eL(){
    $.each(tabs.tabLink, function(i){
      $(tabs.tabLink[i]).on('click', function(e){
        e.preventDefault();
        tabs.toggleTabs(this);
      });
    });
  },
  toggleTabs: function toggleTabs(tab){
    // show clicked tab
    var content = $(tab).data('id');
    // remove classes from other tabs
    $('.tab-links.active').removeClass('active');
    $('.tabbed-content.show').removeClass('show');
    $(tab).addClass('active');
    $('#'+content).addClass('show');
  }
};
