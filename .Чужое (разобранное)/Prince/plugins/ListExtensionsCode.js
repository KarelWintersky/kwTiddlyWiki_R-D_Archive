/***
!Metadata:
|''Name:''|ListExtCode|
|''Description:''|List of loaded external scripts|
|''Version:''|1.1.1|
|''Date:''|Sep 06, 2006|
|''Source:''|http://sourceforge.net/project/showfiles.php?group_id=150646|
|''Author:''|Peter Burgey, Bram Chen|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License]]|
|''~CoreVersion:''|2.0.11|
|''Browser:''|Firefox 1.5+; InternetExplorer 6.0; Opera 9|
|''Required:''|NestedSlidersPlugin|

!Syntax:
{{{<<listExtCode>>}}}
!Revision History:
<<<
v1.1.1 (Sep 06, 2006)
* Move some strings to macro properties for localization, by Bram
v1.1.0 (Aug 29, 2006)
* Codes cleaned up and feature extended for all external scripts, by Bram
v1.0.0 (Aug 25, 2006) 
* initial release
<<<
!Code section:
***/
//{{{
version.extensions.listExtCode = {major: 1, minor: 1, revision: 1,
	date: new Date("Sep 06, 2006"),
	name: "ListExtCode",
	type: "Macro",
	author: "Peter Burgey, Bram Chen",
	source: "http://sourceforge.net/project/showfiles.php?group_id=150646"
};
config.macros.listExtCode = {
	rpTitle: "|@@font-size: 1.5em;List of external scripts@@|c\n|!Location|!Codes|\n",
	title: "ViewCodes",
	view: "View",
	closeView: "Close",
	handler: function(place,macroName,params){
		var theInfo, exts=this.rpTitle;
		var scriptList = document.getElementsByTagName('script');
		for (var i=0; i<scriptList.length-1; i++) {
			var scriptfile = scriptList[i].src;
			if (scriptList[i].src) {
				theInfo = "<html><input type=\"button\" href=\"javascript:;\"  ";
				theInfo += "onclick=\"config.macros.listExtCode.ViewCode('"+scriptfile+"'); \" ";
				theInfo += "value=\""+this.view+"\"></html>";
				exts += "|bgcolor(#eee):" + scriptfile.replace(/file:\/\/\/|file:\/\/localhost\//,"") + "|" + theInfo + "|\n";
			}
		}
		wikify(exts, place);
	}
};

config.macros.listExtCode.ViewCode = function (sourceName)
	{
	var srcText = "<html><iframe id='showCode' type='text/plain' width=100% height=360 src='" + sourceName + "'></ifram></html>";
	// some codes are modified from the report section of ImportTiddlersPlugin

	var title = config.macros.listExtCode.title;
	var closeView= "<html><input type=\"button\" href=\"javascript:;\" ";
	closeView += "onclick=\"story.closeTiddler('"+title+"'); store.deleteTiddler('"+title+"');\" ";
	closeView += "value=\""+config.macros.listExtCode.closeView+"\"></html>\n\n";
	
	// get/create the tiddler of view history
	var rpText = config.shadowTiddlers[title];
	rpText = (rpText)?rpText.substring(0,rpText.lastIndexOf(closeView)):closeView;

	// format the report content
	rpText =rpText.replace(/\+\+\+\+/,"+++");

	var now = new Date();
	var newText = "On "+now.toLocaleString()+", "+config.options.txtUserName + "\n";
	sourceName = sourceName.replace(/file:\/\/\/|file:\/\/localhost\//,"");
	newText += "++++^60em^[Source of " + sourceName + "]\n" + srcText + "\n===\n";

	// update the content of and show the tiddler
	config.shadowTiddlers[title] = rpText + newText +'\n----\n' + closeView;

	story.displayTiddler(null,title,1,null,null,false); 
	story.refreshTiddler(title,1,true); 
	};
//}}}