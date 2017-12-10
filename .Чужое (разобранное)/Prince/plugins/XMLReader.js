/***
!Metadata:
|''Name:''|XMLReader|
|''Description:''||
|''Version:''|1.5.1|
|''Date:''|Mar 10, 2007|
|''Source:''|http://sourceforge.net/project/showfiles.php?group_id=150646|
|''Author:''|BramChen (bram.chen (at) gmail (dot) com)|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License]]|
|''~CoreVersion:''|2.1.0|
|''Browser:''|Firefox 1.5+; InternetExplorer 6.0|
|''Required:''|As the param "asHtml" is used, [[NestedSlidersPlugin|http://www.tiddlytools.com/#NestedSlidersPlugin]] should be installed|
!Syntax:
{{{<<rssfeed withDesc|noDesc|asHtml rssfeed.xml|http://www.example.com/rssfeed.rdf>>}}}
!Revision History:
|''Version''|''Date''|''Note''|
|1.5.1|May 10, 2007|Changed 'cache: []' to 'cache: {}'|
|1.5.0|Mar 04, 2007|Tweaked codes, could be easier reused.|
|1.2.0|Jul 20, 2006|Runs compatibly with TW 2.1.0 (rev #403+)|
|1.1.0|Jul 10, 2006)|change xmlhttp.send(null)/send() to xmlhttp.send("") for more compatibility for some browsers|
|1.0.0|Mar 11, 2006|Initial release|
|~|~|This macro is reworked from RssNewsMacro, but it can be easy to extended to support different structure of xml document from rss feeds|
|~|~|You could uninstall the RssNewsMacro, but still use the original syntax,<<br>>{{{<<rssfeed  withDesc|noDesc|asHtml "rssfeed.xml"|"http://www.example.com/rssfeed.rdf">>}}}|

!Code section:
***/
//{{{
version.extensions.xmlreader = {major: 1, minor: 5, revision: 1,
	date: new Date("May 10, 2007"),
	name: "XMLReader",
	type: "Macro",
	author: "BramChen",
	source: "http://sourceforge.net/project/showfiles.php?group_id=150646"
};

config.messages.XmlReader = {
		errorInDataRetriveing: "Problem retrieving XML data: %0",
		invalidXML: "Invalid XML retrieved from: %0",
		urlNotAccessible: "Access to %0 is not allowed,\nPlease check the setting of your browser:\n1.For Gecko based, you should set the 'signed.applets.codebase_principal_support' to be true, in about:config.\n2.For IE, you should add this web site to your trust list."
};

function getXMLHttpRequest(){
	var xmlhttp;
	try {xmlhttp=new XMLHttpRequest();}
	catch (ex) {
		try {xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");}
		catch (ex) {
			try {xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}
			catch (ex) {displayMessage(ex.description?ex.description:ex.toString());return null;}
		}
	}
	return xmlhttp;
};

function XmlReader(place,withDesc,xmlURL) {
	this.xmlhttp = null;
	this.place = place;
	this.xmlURL = xmlURL;
	this.withDesc = withDesc;
	this.itemStructure = {title:'Title',link:'Link',pubDate:'PubDate',description:'Desc'};
//	this.rsTemplate = function(){var t='';for (var i in itemStructure){t+='_'+itemStructure[i]}};
	this.rsTemplate = '_pubDate\n**[[_title|_link]]_description';
	this.items = {Elm: "%0Elm", Text: "_%0"};
	this.keyItem = "item";
	this.dateFormat = "DDD, DD MMM YYYY";
	this.results = null;
	this.groupBy = null;
	return this;
};

XmlReader.prototype.asyncGet = function (xmlURL,callback){
	var xmlhttp = getXMLHttpRequest();
	if (!xmlhttp){
		return;
	}
	this.xmlhttp = xmlhttp;
	if (window.netscape){
		if (this.isCrossSite(xmlURL)){
			try {netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
			catch (e) { displayMessage(e.description?e.description:e.toString()); }
		}
	}
//	if (xmlhttp.overrideMimeType) {xmlhttp.overrideMimeType('text/xml');}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200 || xmlhttp.status===0) {
				if (callback) callback(xmlURL,xmlhttp);
			}
			else {
				displayMessage(config.messages.XmlReader.errorInDataRetriveing.format([xmlhttp.statusText]));
			}
		}
	};
	try {
		var url=xmlURL+(xmlURL.indexOf('?')<0?'?':'&')+'nocache='+Math.random();
		xmlhttp.open("GET",url,true);
		xmlhttp.send("");
	}
	catch (e) {
		wikify(e.toString()+config.messages.XmlReader.urlNotAccessible.format([xmlURL]), this.place);
	}
	return xmlhttp;
};

XmlReader.prototype.genLists = function(xml){
	var itemList = xml.getElementsByTagName(this.keyItem);
	var itemStructure = this.itemStructure;
	var items = this.items;
	var rsLists='', rssItem; this.groupBy='';
	for (var i=0; i<itemList.length; i++){
		var itemElms=[],itemTexts=[];
		var rsTemplate=this.rsTemplate;
		for (var j in itemStructure){
			var itemElm = items.Elm.format([j]);
			var itemText = items.Text.format([j]);
			itemElms[itemElm] = itemList[i].getElementsByTagName(j).item(0);
			if(itemElms[itemElm]){
				var theTitle = itemStructure[j];
				var theText = (itemElms[itemElm].firstChild)?itemElms[itemElm].firstChild.nodeValue:'';
				rsTemplate=this.convertTemplate(rsTemplate,j,theText);
			}
			else {
				rsTemplate = rsTemplate.replace('_'+j, '');
			}
		}
		rsLists += rsTemplate;
	}
	return rsLists;
};
	
XmlReader.prototype.convertTemplate = function(rsTemplate,j,theText){
	switch (j){
		case 'title':
			rsTemplate = rsTemplate.replace(/_title/,theText.replace(/\[|\]/g,''));
			break;
		case 'link':
			rsTemplate = rsTemplate.replace(/_link/, theText);
			break;
		case 'pubDate':
			theText = this.dateFormatString(this.dateFormat, theText);
			if (this.groupBy == theText){
				rsTemplate = rsTemplate.replace(/_pubDate/, '');
			}
			else{
				rsTemplate = rsTemplate.replace(/_pubDate/, '\n* '+theText);
				this.groupBy = theText;
			}
			break;
		case 'description':
			var regexpDesc = new RegExp("withDesc|asHtml","g");
			if (regexpDesc.exec(this.withDesc)  && theText){
				var _description = theText.replace(/\n/g,' ');
					_description =_description.replace(/<br \/>/ig,'\n');				
				if (version.extensions.nestedSliders){
					_description = ((this.withDesc == "asHtml")?"<html>"+_description+"</html>":_description);
					rsTemplate = rsTemplate.replace(/_description/,'+++[...]'+_description+'\n===\n');
				}
				else {
					rsTemplate = rsTemplate.replace(/_description/,_description+'\n');
				}
			}
			else {
				rsTemplate = rsTemplate.replace(/_description/,'');
			}
			break;
	}
	return (rsTemplate);
};

XmlReader.prototype.dateFormatString = function(template, theDate){
	var dateString = new Date(theDate);
	template = template.replace(/hh|mm|ss/g,'');
	return dateString.formatString(template);
};

XmlReader.prototype.isCrossSite = function (url){
	var result = false;
	var curLoc = document.location;
	if (url.indexOf(":") != -1 && curLoc.protocol.indexOf("http") != -1) {
		var re=/(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/;
		var rsURL=url.match(re);
		for (var i=0; i<rsURL.length; i++){
			rsURL[i]=(typeof rsURL[i] == 'undefined')?'':rsURL[i];
		}
		result = (curLoc.protocol == rsURL[1] && curLoc.host == rsURL[2] && curLoc.port == rsURL[3]);
	}
	return (!result);
};
//}}}
/***
!Macro rssfeed
***/
//{{{
config.macros.rssfeed = {
	cache: {},
	dateFormat: "YYYY/0MM/0DD",
	itemStructure: {title:'Title',link:'Link',pubDate:'PubDate',description:'Desc'},
	rsTemplate: '_pubDate\n**[[_title|_link]]_description',
	items: {Elm: "%0Elm", Text: "_%0"},
	keyItem: "item"
};

config.macros.rssfeed.handler = function(place,macroName,params){
	var withDesc = params[0];
	var xmlURL = params[1];
	var rss = new XmlReader(place,withDesc,xmlURL);
	rss.itemStructure = this.itemStructure;
	rss.rsTemplate = this.rsTemplate;
	rss.items = this.items;
	rss.keyItem = this.keyItem;
	rss.dateFormat = this.dateFormat;
	var processResponse = function(xmlURL,xmlhttp){
		if (window.netscape){
			if (rss.isCrossSite(xmlURL)){
				try {netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");}
				catch (e) { displayMessage(e.description?e.description:e.toString()); }
			}
		}
		if (xmlhttp.responseXML){
			config.macros.rssfeed.cache[xmlURL] = xmlhttp;
			wikify(rss.genLists(xmlhttp.responseXML),place);
		}
		else {
			wikify("<html>"+xmlhttp.responseText+"</html>", place);
			displayMessage(config.messages.XmlReader.invalidXML.format([xmlURL]));
		}
	};
	if (config.macros.rssfeed.cache[xmlURL]) {
		wikify("^^(//from cache//)^^",place);
		processResponse(xmlURL,config.macros.rssfeed.cache[xmlURL]);
	}
	else {
		var xmlhttp = rss.asyncGet(xmlURL, processResponse);
	}
};
//# ''To be backward compatibly with previous xmlreader''
config.macros.xmlreader=config.macros.rssfeed;
//}}}