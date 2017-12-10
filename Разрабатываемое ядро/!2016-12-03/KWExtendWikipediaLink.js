/***
|''Name:''|KWExtendWikipediaLink|
|''Version:''|1.0 (2016-12-03)|
|''Author:''|KarelWintersky|
|''Type:''|Plugin|
|''Required core:''|2.7.0+ with jQuery 1.8.1|
!Description
Add more useful custom formatter for russian wikipedia links.

!Example
 {{{ [wiki[Санкт-Петербург]] }}} -- [wiki[Санкт-Петербург]]

!Revision History
1.0 (2016-12-03) INITIAL by KarelWintersky
1.1 (2016-12-03) added options

!Code
***/

//{{{
// Ensure that this plugin is only installed once.
if (!version.extensions.KWExtendWikipediaLink){
    version.extensions.KWExtendWikipediaLink = {
        installed: true,
        wikipedia_link_url: 'https://ru.wikipedia.org/wiki/',
        wikipedia_link_class: 'wikipediaLink'
    };

    config.formatters.push(
        {
            name: "WikipediaLink",
            match: "\\[[W|w][I|i][K|k][I|i]\\[",
            lookaheadRegExp: /\[[W|w][I|i][K|k][I|i]\[(.*?)\]\]/mg,
            handler: function(w)
            {
                this.lookaheadRegExp.lastIndex = w.matchStart;
                var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
                var options = version.extensions.KWExtendWikipediaLink;

                if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
                    var text = lookaheadMatch[1];
                    var e = createExternalLink(w.output, options.wikipedia_link_url + text);
                    if (!!options.wikipedia_link_class) {
                        jQuery(e).addClass( options.wikipedia_link_class );
                    }
                    createTiddlyText(e, text);
                    w.nextMatch = this.lookaheadRegExp.lastIndex;
                }
            }
        }
    );
} //# end of "install only once"
//}}}
//{{{
setStylesheet('[href*="wikipedia.org"]:before {'+
    '    display: inline-block;'+
    '    margin-right: 3px;'+
    '    vertical-align: -20%;'+
    '    content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGMTE3NDA3MjA2ODExODU5NUMwRUQ4MDVCOEU2NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMTNFRjI1NkI3NzIxMUUzQUY3REQ1NjY3RjIxN0RDQSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMTNFRjI1NUI3NzIxMUUzQUY3REQ1NjY3RjIxN0RDQSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkI1MjNCRUZEMUMyMDY4MTE4NTk1QzBFRDgwNUI4RTY1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY5N0YxMTc0MDcyMDY4MTE4NTk1QzBFRDgwNUI4RTY1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZQNOAgAAAztJREFUeNo0U1loVGcYPXebu8zUmGhIp4nNgA9CYlyCuGAEa7NREOOCG6iJUaOJCooivrQIhUJbNViwrQ/VQmhR4wI+y8REneCTPprgBIWopAV1wszd53r+K164/HP/+c/5z3e+80nX/x2CpiVgGDp0XUcikVjB70OKorTKslQbRUC5HL4OgiDred4V1/XGXdcBV/i+D/UT2IBpmpppGj8mEvrRREKzSABJkgAShOUwQ4IeTdN2KYr6O4nPAnBBdlXcSqBmWdYNrl3imwchy/InAggFZYRhKPYNEp/g/qIoiraWy5GjUjIsK3muqqqyyzJNEAVVVWGQKCBIgAWh67rxy4uouPQd93+iqhPSo7GRJbbtPHmRz+tfpFLIZOpj0PT0a6TTXyKZTGJiYhLV1dXQ6dPE8wmUSiU0NjaGVLFaVlWtv7Jyrj46Nob9Bw7FhgoFPb0H8fDhY/7W8P0P56gmQMWcOfjl1wuY+e9/pFJJhecGZLrUVlFRgTOnT8VS81NTWLWmBcePDeB+NovHuRx2796Fjs5OvH//AcuWLcVA/+G4Y6z2G3ol17I9WFBXh81dm3D+wkU4pVkcOdyHyclJXL32N3r3d8Nn/cO3bqO9vS0uUbRXkuS0zDriD9tx0H+kD0+fPsODB6P4OrMQba2tEOQ1NTXI56foyzRav90QexCDEElyGJbfMCiwbRsNDQ3o6GjH4KXfMFt4h5mZGTynabncOLIjI1i9aiVrT4Hui2yI1r5VuvftaWI4mlVVoQcqMvX1uDg4iJcvX2HduhbU1dViaOifuIX7uvcionyHah3HFes9mRIve57rC6mFwiyam5djSVMThodvYdvWLejt6UFufBzz589DmqUIpeIs3zKjfFnZuWP7G5pRyXiuEckTEf4qncbalrVoWrxYtAtVVfPQ2dHGdCqs3+bNtiD6kyr+kO7evilmwbBM645hGp2chRj0OX3iEbNSLBZj88QewVkSbeRQFVUxVXwcmrqF0f1Z1/0+lqTRF94oQXSpUCjExlF2QIK/ePNJrsV4GoPAF+1gbyM7DINjvu9dZ/r6WMp6EqQFAfv+NgjCUQKu8P8RAfQ8Px6wjwIMALbvqBBV3D1LAAAAAElFTkSuQmCC);}',
    'KWExtendWikipediaLinkStyles');
//}}}