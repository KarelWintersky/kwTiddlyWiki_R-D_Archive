/***
|''Name:''|BreadCrumbsPlugin|
|''Version:''|2.2.1 (05-July-2007)|
|''Author:''|AlanHecht|
|''Adapted By:''|[[Jack]]|
|''Type:''|Plugin|
!Description
This plugin creates an area at the top of the tiddler area that displays "breadcrumbs" of where you've been. This is especially useful for ~TWs using SinglePageMode by Eric Schulman.
!Usage
Just install the plugin and tag with systemConfig. Optionally position the following div in your PageTemplate to control the positioning of the breadcrumbs menu:
{{{
<div id='breadCrumbs'></div>
}}}
!Revision History
* Original by AlanHecht
* 2.0 Made 2.0.x compatible by [[Jack]]
* Made 2.0.10 compatible (onstart paramifier)
* Bugfix -> return false in onClickTiddlerLink()
* 2.2 Made 2.2.x compatible
!Code
***/

// // Use the following line to set the number of breadcrumbs to display before rotating them off the list.
//{{{
version.extensions.breadCrumbs = {major: 2, minor: 2, revision: 1, date: new Date("Jul 5, 2007")};
var crumbsToShow = 7;
var breadCrumbs = [];

onClickTiddlerLink_orig_breadCrumbs = onClickTiddlerLink;
onClickTiddlerLink = function(e){
 onClickTiddlerLink_orig_breadCrumbs(e);
 breadcrumbsAdd(e);
 return false;
}

restart_orig_breadCrumbs = restart;
function restart() {
 invokeParamifier(params,"onstart");
 var defaultParams = store.getTiddlerText("DefaultTiddlers").parseParams("open",null,false);
 invokeParamifier(defaultParams,"onstart");
 breadCrumbs = [];
 breadcrumbsRefresh();
 window.scrollTo(0,0);
 return false;
}

function breadcrumbsAdd(e) {
 var uniqueCrumb = true;
 var crumbIndex = 0;
 if (!e) var e = window.event;
 var target = resolveTarget(e);
 var thisCrumb="[["+resolveTarget(e).getAttribute("tiddlyLink")+"]]";
 var lastInactiveCrumb = breadCrumbs.length -(breadCrumbs.length < crumbsToShow ? breadCrumbs.length : crumbsToShow);
 for(t=lastInactiveCrumb; t<breadCrumbs.length; t++)
 if(breadCrumbs[t] == thisCrumb) {
 uniqueCrumb = false;
 crumbIndex = t+1;
 }
 if(uniqueCrumb)
 breadCrumbs.push(thisCrumb);
 else
 breadCrumbs = breadCrumbs.slice(0,crumbIndex);
 breadcrumbsRefresh(); 
}

function breadcrumbsRefresh() {
 
 if (!document.getElementById("breadCrumbs")) {
 // Create breadCrumbs div
 var ca = document.createElement("div");
 ca.id = "breadCrumbs";
 ca.style.visibility= "hidden";
 var targetArea = document.getElementById("tiddlerDisplay")||document.getElementById("storyDisplay");
 targetArea.parentNode.insertBefore(ca,targetArea);
 }

 var crumbArea = document.getElementById("breadCrumbs");
 crumbArea.style.visibility = "visible";
 removeChildren(crumbArea);
 createTiddlyButton(crumbArea,"Home",null,restart);
 crumbArea.appendChild(document.createTextNode(" > "));
 
 var crumbLine = "";
 var crumbCount = breadCrumbs.length;
 var firstCrumb = crumbCount -(crumbCount < crumbsToShow ? crumbCount : crumbsToShow);
 for(t=firstCrumb; t<crumbCount; t++) {
 if(t != firstCrumb)
 crumbLine += " > ";
 crumbLine += breadCrumbs[t];
 }
 wikify(crumbLine,crumbArea)
}


//}}}