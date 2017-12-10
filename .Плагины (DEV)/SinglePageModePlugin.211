/***
|Version:|2.1.1|
***/
//{{{
version.extensions.SinglePageMode= {major: 2, minor: 1, revision: 1, date: new Date(2006,2,4)};

if (config.options.chkSinglePageMode==undefined)
 config.options.chkSinglePageMode=false;

config.shadowTiddlers.AdvancedOptions
 += "\n<<option chkSinglePageMode>> Display one tiddler at a time";

config.SPMTimer = 0;
config.lastURL = window.location.hash;
function checkLastURL()
{
 if (!config.options.chkSinglePageMode)
 { window.clearInterval(config.SPMTimer); config.SPMTimer=0; return; }
 if (config.lastURL == window.location.hash)
 return;
 var tiddlerName = convertUTF8ToUnicode(decodeURI(window.location.hash.substr(1)));
 tiddlerName=tiddlerName.replace(/\[\[/,"").replace(/\]\]/,""); // strip any [[ ]] bracketing
 if (tiddlerName.length) story.displayTiddler(null,tiddlerName,1,null,null);
}

Story.prototype.coreDisplayTiddler=Story.prototype.displayTiddler;
Story.prototype.displayTiddler = function(srcElement,title,template,animate,slowly)
{
 if (config.options.chkSinglePageMode) {
 window.location.hash = encodeURIComponent(String.encodeTiddlyLink(title));
 config.lastURL = window.location.hash;
 document.title = wikifyPlain("SiteTitle") + " - " + title;
 story.closeAllTiddlers();
 if (!config.SPMTimer) config.SPMTimer=window.setInterval(function() {checkLastURL();},1000);
 }
 this.coreDisplayTiddler(srcElement,title,template,animate,slowly)
}

Story.prototype.coreDisplayTiddlers=Story.prototype.displayTiddlers;
Story.prototype.displayTiddlers = function(srcElement,titles,template,unused1,unused2,animate,slowly)
{
 // suspend single-page mode when displaying multiple tiddlers
 var save=config.options.chkSinglePageMode;
 config.options.chkSinglePageMode=false;
 this.coreDisplayTiddlers(srcElement,titles,template,unused1,unused2,animate,slowly);
 config.options.chkSinglePageMode=save;
}
//}}}