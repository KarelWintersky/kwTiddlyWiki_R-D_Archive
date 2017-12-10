/***
!Metadata:
|''Name:''|Breadcrumbs2Plugin|
|''Description:''||
|''Version:''|1.5.0|
|''Date:''|May 29, 2008|
|''Source:''|http://sourceforge.net/project/showfiles.php?group_id=150646|
|''Author:''|Bram Chen (original: Alan Hecht)|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License]]|
|''~CoreVersion:''|2.4.0|
|''Browser:''|Firefox 1.5+; InternetExplorer 6.0|

!Revision History:
|''Version''|''Date''|''Note''|
|1.5.0|May 29, 2008|Runs compatibly with TW 2.4.0, using array method indexOf() instead of find() to seek breadcrumbs.<br>Fewer grobal variables and functions are used.|
|1.4.2|Feb 15, 2007|Runs compatibly with TW 2.2.0 (rev #1501+)|
|1.4.1|Aug 05, 2006|in restartHome(), check for valid crumbArea before setting style, by Eric|
|1.4.0|Aug 02, 2006|Fixed bug, the redefined onClickTiddlerLink_orig_breadCrumbs works incorrectly on IE|
|1.3.0|Jul 20, 2006|Runs compatibly with TW 2.1.0 (rev #403+)|
|1.2.0|Feb 07, 2006|change globle array breadCrumbs to config.breadCrumbs by Eric's suggestion|
|1.1.0|Feb 04, 2006|JSLint checked|
|1.0.0|Feb 01, 2006|TW2 ready and code Cleaned-up|

!Code section:
***/
//{{{
if(!version.extensions.breadCrumb2)
	version.extensions.breadCrumb2 = {installed:true};

window.onClickTiddlerLink_orig_breadCrumbs = window.onClickTiddlerLink;
window.onClickTiddlerLink = function(e){
	if (!e) {var e = window.event;}	
	window.onClickTiddlerLink_orig_breadCrumbs(e);
	BreadCrumb.addCrumb(e);
	return false;
};
var BreadCrumb = {
	breadCrumbs: []
}

BreadCrumb.addCrumb = function(e){
	if (!e) {var e = window.event;}
	var thisCrumb = "[[" + resolveTarget(e).getAttribute("tiddlyLink") + "]]";
	var ind = this.breadCrumbs.indexOf(thisCrumb);
	if(ind == -1){
		this.breadCrumbs.push(thisCrumb);
	}
	else{
		this.breadCrumbs.length = ind++;
		}
	this.refreshCrumbs();
	return false;
}

BreadCrumb.refreshCrumbs = function(){
	var crumbArea = document.getElementById("breadCrumbs");
	if (!crumbArea) {
		crumbArea = document.createElement("div");
		crumbArea.id = "breadCrumbs";
		crumbArea.style.visibility = "hidden";
		var targetArea = document.getElementById("tiddlerDisplay");
			targetArea = targetArea || document.getElementById("storyDisplay");
			targetArea.parentNode.insertBefore(crumbArea,targetArea);
	}
	crumbArea.style.visibility = "visible";
	removeChildren(crumbArea);
	createTiddlyButton(crumbArea,"Home",null,BreadCrumb.restartHome);
	wikify(" || " + this.breadCrumbs.join(' > '),crumbArea);
}

BreadCrumb.restartHome = function(){
	story.closeAllTiddlers();
	restart();
	this.breadCrumbs = [];
	var crumbArea = document.getElementById("breadCrumbs");
	if (crumbArea) // ELS: added check to make sure crumbArea exists
		crumbArea.style.visibility = "hidden";
}
//}}}