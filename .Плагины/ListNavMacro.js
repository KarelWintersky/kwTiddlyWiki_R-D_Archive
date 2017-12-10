/***
simplified version of the ListNavMacro:
    http://svn.tiddlywiki.org/Trunk/contributors/FND/plugins/ListNavMacro.js

!Usage
{{{
<<listnav tiddler>>
}}}
<<listnav [[ColorPalette]]>>
***/
//{{{
(function($) { //# set up alias

config.macros.listnav = { // create macro object
	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		// target tiddler passed in as macro parameter
		var title = params[0];
		// read list items from tiddler contents
		var text = store.getTiddlerText(title);
		if(text) {
			// generate nav bar
			$("<div />").attr("id", "listnav-nav").appendTo(place);
			// generate list
			var items = text.split("\n");
			var list = $("<ul />").attr("id", "listnav").appendTo(place);
			$.each(items, function(i, itm) {
				$("<li />").text(itm).appendTo(list);
			});
			// apply listnav
			list.listnav();
		}
	}
};

// add default styles (adapted from http://www.ihwy.com/labs/downloads/jquery-listnav/2.0/listnav.css)
config.shadowTiddlers.StyleSheetListNav = "/*{{{*/\n" +
	".listNav { margin: 0 0 10px; }\n" +
	".ln-letters { overflow: hidden; }\n" +
	".ln-letters a { font-size: 0.9em; display: block; float: left; padding: 2px 6px; border: 1px solid #eee; border-right: none; text-decoration: none; }\n"+
	".ln-letters a.ln-last { border-right: 1px solid #eee; }\n" +
	".ln-letters a:hover, .ln-letters a.ln-selected { background-color: #eaeaea; }\n" +
	".ln-letters a.ln-disabled { color: #ccc; }\n" +
	".ln-letter-count { text-align: center; font-size: 0.8em; line-height: 1; margin-bottom: 3px; color: #336699; }\n" +
	"/*}}}*/";
store.addNotification("StyleSheetListNav", refreshStyles);

})(jQuery);
//}}}