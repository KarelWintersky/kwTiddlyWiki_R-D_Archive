/***
|Name|RevisionsPlugin|
|Source|http://www.linux-lovers.be/RevisionsPlugin/#RevisionsPlugin|
|Version|1.0.1|
|Author|Willy De la Court (willy [dot] delacourt [at] telenet [dot] be)|
|License|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.5|
|Type|plugin|
|Requires||
|Overrides|config.commands.saveTiddler|
|Description|Create revisions of a tiddler when changes are saved|
!!!Usage
<<<
This plugin automatically updates the default (shadow) ToolbarCommands slice definitions to insert the ''revisions'' command.

When you select the ''revisions'' command, a drop down popup is shown with all the revisions of the current tiddler.

The plugin takes control of the ''saveTiddler'' command and check the tags of the current tiddler. If the current tiddler is taged with the <<tag KeepRevisions>> tag then the ''saveTiddler'' command automatically will create a new revision of the tiddler.

All revision tiddlers will be tagged with <<tag Revisions>>, <<tag excludeLists>> and <<tag excludeMissing>>.

Note: if you are already using customized toolbar definitions, you will need to manually add the ''revisions'' toolbar command to your existing ToolbarCommands tiddler, e.g.:
{{{
|EditToolbar|... revisions ... |
}}}
<<<
!!!Revisions
<<<
2009.03.27 [1.0.1] added some documentation
2009.03.23 [1.0.0] initial version
<<<
!!!Code
***/
//{{{
version.extensions.RevisionsPlugin= {major: 1, minor: 0, revision: 0, date: new Date(2009,3,23)};

config.extensions.RevisionsPlugin = {};
config.extensions.RevisionsPlugin.core_saveTiddler_handler = config.commands.saveTiddler.handler;
merge(config.commands.saveTiddler,{
	zeroPad: 4,
	keepRevisonsTag: "KeepRevisions",
	suffixText: " Revision(%0)",
	newtags: ["Revisions", "excludeLists", "excludeMissing"],
	keepTags: false
	});

config.commands.saveTiddler.handler = function(event,src,title) {
	if(store.tiddlerExists(title) && store.getTiddler(title).isTagged(this.keepRevisonsTag)) {
		// Not a new tiddler and tagged with keepRevisonsTag
		n = 1;
		var newTitle = title + this.suffixText.format([String.zeroPad(n, this.zeroPad)]);
		while (store.tiddlerExists(newTitle) || document.getElementById(story.idPrefix + newTitle)) {
			n++;
			newTitle = title + this.suffixText.format([String.zeroPad(n, this.zeroPad)]);
		}
		var text = store.getTiddlerText(title, '');
		var newtags = this.newtags;
		var newfields = {};
		var tid = store.getTiddler(title);
		if (tid) {
			if(this.keepTags)
				for (var t = 0; t < tid.tags.length; t++) newtags.push(tid.tags[t]);
			store.forEachField(tid,
				function(t, f, v) {
					newfields[f] = v;
				},
			true);
		}
		store.saveTiddler(newTitle, newTitle, text, tid.modifier, tid.modified, newtags, newfields, false);
	}
	return config.extensions.RevisionsPlugin.core_saveTiddler_handler.apply(this,arguments);
}

config.commands.revisions = {
	type: "popup",
	text: "revisions",
	tooltip: "Show revisions of this tiddler",
	shortSuffixText: " Revision("
}

config.commands.revisions.handlePopup = function(popup,title) {
	var tiddlertitle = title;
	store.forEachTiddler(function(title,tiddler) {
		if(title.startsWith(tiddlertitle + config.commands.revisions.shortSuffixText))
			createTiddlyLink(createTiddlyElement(popup,"li"),title,true,null,false,null,true);
		});
};

config.shadowTiddlers.ToolbarCommands = config.shadowTiddlers.ToolbarCommands.replace(
	/jump/m,
	"revisions jump");

//}}}