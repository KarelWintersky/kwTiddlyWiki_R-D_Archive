/***
!Metadata:
|''Name:''|SimpleClockPlugin|
|''Description:''||
|''Version:''|1.0.0|
|''Date:''|Apr 16, 2007|
|''Source:''|http://sourceforge.net/project/showfiles.php?group_id=150646|
|''Author:''|BramChen (bram.chen (at) gmail (dot) com)|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License]]|
|''~CoreVersion:''|2.2.0|
|''Browser:''|Firefox 1.5+,IE6,Opera9|
!Usage:
{{{

<<simpleclock scFormat simpleClock>>
}}}
!Revision History:
|''Version''|''Date''|''Note''|
|1.0.0|Apr 16, 2007|Initial release|
!Code section:
***/

//{{{
version.extensions.simpleclock = {major: 1, minor: 0, revision: 0, date: new Date("Apr 16, 2007")};

if (typeof ptwAddons == "undefined") ptwAddons = {};

merge(ptwAddons, {
	simpleClock:{
		scFormat:"YYYY-0MM-0DD 0hh:0mm:0ss", 
		scName: "simpleClock",
		scRefresh: function (wrapper,scFormat){
			var now = new Date();
			wrapper.innerHTML = now.formatString(scFormat);
			return false;
		}
	}
});

config.macros.simpleclock = {};

config.macros.simpleclock.handler = function(place,macroName,params){
	var scFormat = params[0]?params[0]:ptwAddons.simpleClock.scFormat;
	var scName = params[1]?params[1]:ptwAddons.simpleClock.scName;
	var wrapper = createTiddlyElement(place,'span',scName,scName);
	var scInterval = setInterval(function(){ptwAddons.simpleClock.scRefresh(wrapper,scFormat);},1000);
}
//}}}