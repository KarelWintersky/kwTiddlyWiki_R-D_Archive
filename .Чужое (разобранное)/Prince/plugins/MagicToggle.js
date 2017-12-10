/***
!Metadata:
|''Name:''|MagicToggle|
|''Description:''|Show/ Hide specific element, support multilingual, also it is easy to be extended and localized,, all changes of elements are affected on-fly|
|''Version:''|2.1|
|''Date:''|Nov 25, 2008|
|''Source:''|http://sourceforge.net/project/showfiles.php?group_id=150646|
|''Author:''|BramChen (bram.chen (at) gmail (dot) com)|
|''License:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''~CoreVersion:''|2.2.0|
|''Browser:''|Firefox 1.5+|
!Usage
#Import [[MagicToggle]]
#Customization
## add/edit config tiddler with json format,<br /> examples: [[MagicToggleConfig.en]] and [[MagicToggleConfig.zh-Hant]] (for Traditional Chinese).
## add/edit customized elements and attributes to config tiddlers
#Syntax:
{{{
<<magicToggle "ElementIdentifier">>
}}}
!Examples
<<tiddler [[MagicToggle##ExampleOutput]] with:{{var r = '';
for (i in MagicToggle.attr) r += '\n*<'+'<'+'magicToggle ' + i + '>'+'>';
}}>>/%
!ExampleOutput
Syntax:
{{{
$1
}}}
Result:
$1
!End of Example%/
{{magicToggleAttr{
!Attr
//{{{
({
	"header": {
		"default": true,
		"hide": {
			"label": "Show Header",
			"styles": ".header {display: none;} #displayArea {top: 1em;} #mainMenu {top:1em;} #sidebar {top: 1em;}"},
		"show": {
			"label": "Hide Header",
			"styles": ".header {display: block;} #displayArea {top: clear;} #mainMenu {top:clear;} #sidebar {top: clear;}"}
	},
	"mainMenu": {
		"default": true,
		"hide": {
			"label": "Show MainMenu",
			"styles": "#mainMenu {display: none;} #displayArea {margin-left: 1em;}"},
		"show": {
			"label": "Hide MainMenu",
			"styles": "#mainMenu {display: block;} #displayArea {margin-left: 14em;}"}
	},
	"sidebar": {
		"default": true,
		"hide": {
			"label": "Show Sidebar",
			"styles": "#sidebar {display: none;} #displayArea {margin-right: 1em;}"},
		"show": {
			"label": "Hide Sidebar",
			"styles": "#sidebar {display: block;} #displayArea {margin-right: 17em;}"}
	},
	"sidebarTabs": {
		"default": true,
		"hide": {
			"label": "Show SidebarTabs",
			"styles": "#sidebarTabs {display: none;}"},
		"show": {
			"label": "Hide SidebarTabs",
			"styles": "#sidebarTabs {display: block;}"}
	},
	"magicToggleAttr": {// sample of customized element
		"default": false,
		"hide": {
			"label": "Show Attributes",
			"tooltip": "Show default attributes",
			"styles": ".magicToggleAttr {display: none;}"},
		"show": {
			"label": "Hide Attributes",
			"tooltip": "Hide default attributes",
			"styles": ".magicToggleAttr {display: block;}"}
	}
})
//}}}
!End of default attributes
}}}
!Code
***/
//{{{

MagicToggle = {};

MagicToggle.config = "MagicToggleConfig.";

MagicToggle.getAttr = function(src){
	try {
		var r=eval(store.getTiddlerText(src));
	}
	catch(ex){
		displayMessage(src + " must be structured with json format");
	};
	return r || {};
};

MagicToggle.attr = MagicToggle.getAttr("MagicToggle##Attr");

MagicToggle.setToggle = function(elmId,cookie){
	var _tLocale=MagicToggle.getAttr(MagicToggle.config+config.locale);
	if (config.options[cookie] === undefined){
		if (_tLocale && _tLocale[elmId] && _tLocale[elmId]["default"] !== undefined)
			config.options[cookie] = _tLocale[elmId]["default"];
		else
			config.options[cookie] = MagicToggle.attr[elmId]["default"];
	}
	var s = (config.options[cookie] ? "show" : "hide");

	if (MagicToggle.attr[elmId] === undefined && _tLocale)
		merge(MagicToggle.attr,_tLocale);
	else {
		if ( _tLocale && _tLocale[elmId] && _tLocale[elmId][s])
			merge(MagicToggle.attr[elmId][s],_tLocale[elmId][s]);
	}
	setStylesheet(MagicToggle.attr[elmId][s]["styles"],("toggle"+elmId));
	var label = MagicToggle.attr[elmId][s]["label"];
	var tooltip =  MagicToggle.attr[elmId][s]["tooltip"] || label;
	return [label,tooltip];
};

config.macros.magicToggle = {
	init: function(){
		for (elmId in MagicToggle.attr){
			MagicToggle.setToggle(elmId,"chkShow"+elmId);
		}
	}
};

config.macros.magicToggle.handler=function (place,macroName,params,wikifier,paramString,tiddler)
{
	var elmId = params[0];
	var cookie = "chkShow"+elmId;

	var btnAttrs = MagicToggle.setToggle(elmId,cookie);

	var onClick = function(ev){
		var e = ev || window.event;
		var btn = this;
		config.options[cookie] = !config.options[cookie];
		saveOptionCookie(cookie);
		var btnAttrs = MagicToggle.setToggle(elmId,cookie);
		btn.innerHTML = btnAttrs[0];
		btn.setAttribute("title",btnAttrs[1]);
		stopEvent(e);
		return false;
	};
	var toggleBtn = createTiddlyButton(place,btnAttrs[0],btnAttrs[1],onClick,"button toggleButton");
};
//}}}