/***
<<mURL "http://google.com" "http://tiddlywiki.com" "http://tiddlywiki.org">>
***/
//{{{
(function($) {

config.macros.mURL = {
	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		var container = $('<div class="mURL" />').appendTo(place);
		$.each(params, function(i, item) {
			var callback = function(ev) {
				var url = $(this).attr("href");
				$("iframe", container).attr("src", url);
				return false;
			};
			$("<a />").attr("href", item).text(i).click(callback).
				appendTo(container);
		});
		var el = $("<iframe />").appendTo(container);
	}
};

})(jQuery);
//}}}
