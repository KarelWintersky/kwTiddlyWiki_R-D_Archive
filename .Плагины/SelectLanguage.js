/***
|''Name:''|SelectLanguage|
|''Version:''|v0.5.0 (Feb 26, 2006)|
|''Source:''|https://sourceforge.net/projects/ptw/|
|''Author:''|BramChen|
|''Type:''|Macro|
!Description
!Syntax/Examples
>{{{<<SwitchPageTemplate [asButton]>>}}}

!Known issues/Todos
* 
Tesed for Firefox only
!Instructions

!Notes
* 
TiddlyWiki version 2.0.0  or above required.
!Revision history
* v0.5.0 (Feb 26, 2006) Codes reworked, no more global variables and functions
* v0.4.1 (Feb 04, 2006) JSLint checked
* v0.4.0 (Feb 04, 2006) Fixed several missing variable declarations
* v0.3.0 (Jan 20, 2006) refreshCode() improved.
* v0.2.0 (Jan 13, 2006) Improve refreshing display aftter language changed .
* v0.1.0 (Jan 09, 2006) Initial release
!Code
***/
//{{{
version.extensions.selectLanguage = {major: 0, minor: 5, revision: 0,
	date: new Date("Feb 26, 2006"),
	name: "SelectLanguage",
	type: "Macro",
	author: "BramChen",
	source: "http://sourceforge.net/project/showfiles.php?group_id=150646"
};
config.macros.selectLanguage = {
	title: "Select Language",
	langTag: "Lang",
	tooltip: "Choose langage of interface",
	buttonModeSwitch: "asButton",
	action: {
		apply: "Apply",
		Warning: "x"
	},
	handler: function(place,macroName,params) {
		var lingo = config.macros.selectLanguage; 
		var langTag = lingo.langTag;
		var buttonMode = (params[0] == lingo.buttonModeSwitch);
		if(buttonMode){
			var toggleButton = createTiddlyButton(place,lingo.title,lingo.tooltip,this.langToggleForm);
		}
		var langFrm = createTiddlyElement(place,"form",null,null,null);
		langFrm.id = langTag; langFrm.name = langTag;
		if(buttonMode){
			langFrm.style.display = "none";
		}
		else {
			var formHeading = document.createElement("h2");
			var formTitle = formHeading.appendChild(document.createTextNode(lingo.title));
			langFrm.appendChild(formHeading);
		}
		langFrm.appendChild(document.createElement("hr"));
		var eTiddlers = store.getTaggedTiddlers(langTag);
		for(var s=0 ; s<eTiddlers.length; s++){
			var tiddler = eTiddlers[s];
			var theChk = document.createElement("input");
			theChk.type = "radio";
			theChk.name = "chk" + langTag ;
			theChk.value = tiddler.title;
			var theText = (s+1).toString() + '. ';
			langFrm.appendChild(theChk);
			langFrm.appendChild(document.createTextNode(theText));
			langFrm.appendChild(createTiddlyLink(place,tiddler.title,true));		
			langFrm.appendChild(document.createElement("br"));
		}
		langFrm.appendChild(document.createElement("br"));
		var btn = lingo.action.apply ;
		var langApply = createTiddlyButton(langFrm,btn,langTag,this.langExcute);
		langFrm.appendChild(document.createElement("hr"));
	},
	refreshCode: function(){
		if (story) {
			story.forEachTiddler(function(title){story.refreshTiddler(title,DEFAULT_VIEW_TEMPLATE,true);});
		}
		refreshDisplay();
	},

	langExcute: function (){
		// 'this' -> langApply
		var langFrm = this.parentNode;
	//	var langTag = this.title;
		for(var s=0 ; s<langFrm.length; s++){
			if (langFrm[s].checked){
				var scriptFiles = langFrm[s].value;
				config.macros.selectLanguage.excuteScript(scriptFiles);		
			}
		}
		return ;
	},
	excuteScript: function (scriptFiles){
		var scripts = store.getRecursiveTiddlerText(scriptFiles)+"\n";
		scripts = scripts.replace(/[;\r]/mg,"\n").split("\n");
		for (var i=0; i<scripts.length-1; i++) {
			var scriptfile = scripts[i].trim();
			if (scriptfile.length < 2 || scriptfile.substr(0,2) == "//"){
				continue;
			}
			var scriptElm = document.createElement("script");
			scriptElm.type = "text/javascript"; scriptElm.src = scriptfile;
			//scriptElm.appendChild(document.createTextNode("config.macros.selectLanguage.refreshCode();"));
			document.getElementsByTagName("head")[0].appendChild(scriptElm); 
			document.getElementsByTagName("head")[0].removeChild(scriptElm);
		}
		if  (setNotifyTimeout){
			var clearNotifyTimeout = clearTimeout(setNotifyTimeout);
		}
		var setNotifyTimeout = setTimeout(function() {config.macros.selectLanguage.refreshCode();},500);
	},

	langToggleForm: function (){
		// this -> toggleButton
		var langFrm = this.nextSibling;
		langFrm.style.display = (langFrm.style.display == "none")? "block":"none" ;
	}
};
//}}}