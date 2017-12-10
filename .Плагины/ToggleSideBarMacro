/***
|''Name:''|ToggleSideBarMacro|
|''Description:''|Provides a button for toggling visibility of the SideBar.|
|''Author:''|Paulo Soares (based on a previous macro from Saq Imtiaz)|
|''Source:''|http://www.math.ist.utl.pt/~psoares/addons.html|
|''Version:''|1.1|
|''Date:''|Jan 28, 2011|
|''License:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/ ]]|
|''~CoreVersion:''|2.5|
***/
//{{{
(function($) {
config.macros.toggleSideBar={
  mode: 'hide',
  arrowShow: "◄",
  arrowHide: "►",
  tooltip: "Toggle sidebar"
};

config.macros.toggleSideBar.handler=function(place){
  var label = (this.mode == "hide")? this.arrowShow : this.arrowHide;
  createTiddlyButton(place,label,this.tooltip,this.onToggleSideBar,"HideSideBarButton");
  if(this.mode == "hide"){ 
    $('#sidebar').hide();
    $('#displayArea').css({'margin-right':'1em'});
  }
};

config.macros.toggleSideBar.onToggleSideBar = function(){
  var cm = config.macros.toggleSideBar;
  var button = this.firstChild;
  var sidebar = $('#sidebar');
  if(sidebar.is(':visible') ) {
    $('#displayArea').css({'margin-right':'1em'});
    button.data = cm.arrowShow;
  } else {
    $('#displayArea').css({'margin-right':''});
    button.data = cm.arrowHide;
  }
  sidebar.toggle();
  return false;
}
})(jQuery)
//}}}