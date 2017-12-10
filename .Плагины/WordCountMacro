/***
|Author:|Simon Baird|
|URL:|http://linktomemacro.tiddlyspot.com/|
(Almost) as posted by BradleyMeck on the mailing list, 21-Oct-2006. To use put this somewhere in your ViewTemplate:
{{{<div style="font-size:150%">(<span macro="wordCount"></span> words)</div>}}}
***/
//{{{
merge(config.macros,{
	wordCount: {
		handler: function(place,macroName,params,wikifier,paramString,tiddler) {
			createTiddlyText(place,tiddler&&tiddler.text?tiddler.text.match(/\w+/g).length:"0");
		}
	}
});
//}}}
