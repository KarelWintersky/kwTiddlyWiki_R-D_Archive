/***
|''Name:''|KWExtendConfFilelinks|
|''Version:''|1.0 (2016-12-03)|
|''Author:''|KarelWintersky|
|''Type:''|Plugin|
!Description
Add more useful custom formatter for russian wikipedia links.

!Example
{{{ [@chars[“ьел]] }}} -- [@chars[“ьел]]
{{{ [@core[—ириус]] }}} -- [@core[—ириус]]

!Revision History
1.0 (2016-12-03) by KarelWintersky

!Code
***/

//{{{
// Ensure that this plugin is only installed once.
if (!version.extensions.KWExtendConfFilelinks){
    version.extensions.KWExtendConfFilelinks = {
        installed: true,
        core: {
            file: 'conf.html',
            link_class: ''
        },
        chars: {
            file: 'conf.chars.html',
            link_class: ''
        }
    };

    config.formatters.push(
        {
            name: "ConfFilelinksCORE",
            match: "\\[[@]?[C|c][O|o][R|r][E|e]\\[",
            lookaheadRegExp: /\[[@]?[C|c][O|o][R|r][E|e]\[(.*?)\]\]/mg,
            handler: function(w)
            {
                this.lookaheadRegExp.lastIndex = w.matchStart;
                var lookaheadMatch = this.lookaheadRegExp.exec(w.source);

                if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
                    var text = lookaheadMatch[1];
                    var e = createExternalLink(w.output, version.extensions.KWExtendConfFilelinks.core.file + '#[' + text + ']');
                    if ( !!version.extensions.KWExtendConfFilelinks.core.link_class ) {
                        jQuery(e).addClass( version.extensions.KWExtendConfFilelinks.core.link_class );
                    }
                    createTiddlyText(e, text);
                    w.nextMatch = this.lookaheadRegExp.lastIndex;
                }
            }
        }
    );
    config.formatters.push(
        {
            name: "ConfFilelinksCHARS",
            match: "\\[[@]?[C|c][H|h][A|a][R|r][S|s]?\\[",
            lookaheadRegExp: /\[[@]?[C|c][H|h][A|a][R|r][S|s]?\[(.*?)\]\]/mg,
            handler: function(w)
            {
                this.lookaheadRegExp.lastIndex = w.matchStart;
                var lookaheadMatch = this.lookaheadRegExp.exec(w.source);

                if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
                    var text = lookaheadMatch[1];
                    var e = createExternalLink(w.output, version.extensions.KWExtendConfFilelinks.chars.file + '#[' + text + ']');
                    if (!!version.extensions.KWExtendConfFilelinks.chars.link_class) {
                        jQuery(e).addClass( version.extensions.KWExtendConfFilelinks.chars.link_class );
                    }
                    createTiddlyText(e, text);
                    w.nextMatch = this.lookaheadRegExp.lastIndex;
                }
            }
        }
    );

} //# end of "install only once"
//}}}
