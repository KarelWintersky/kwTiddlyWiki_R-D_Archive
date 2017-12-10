/***
!Metadata:
|''Name:''|XhtmlRubyPlugin|
|''Description:''|Xhtml Ruby supported|
|''Version:''|0.2.0|
|''Date:''|Jul 20, 2007|
|''Source:''|http://www.sourceforge.net/projects/ptw/|
|''Author:''|BramChen (bram.chen (at) gmail (dot) com)|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License]]|
|''~CoreVersion:''|2.1.0|
|''Browser:''|Firefox 1.5+ (the firefox extension, XTML Ruby support, is required)|
!Usage:
{{{
<<ruby
	<Ruby text before, separated by ','>
	<ruby base>
	<ruby text after>
	[rbLang: <lang code>]
	[rbStyle: <style tiddler>]
	[rbLang: <lang code>]
	[rbTextBefore: <Ruby text before, separated by ','>]
	[rbBase: <ruby base>]
	[rbTextAfter: <ruby text after>]
>>
<<ruby
	[rbStyle: <style tiddler>]
	[rbLang: <lang code>]
	rbTextBefore: <Ruby text before, separated by ','>
	rbBase: <ruby base>
	rbTextAfter: <ruby text after>
>>

or using Xhtml ruby markups directly 
<ruby>
	<rbc>
		<rb> ... </rb>
		<rb> ... </rb>
		...
	</rbc>
	<rtc class="before">
		<rt> ... </rt>
		<rt> ... </rt>
		...
	</rtc>
	<rtc class="after">
		<rt> ... </rt>
		<rt> ... </rt>
		...
		<rt rbspan="..." xml:lang="..."<...</rt>
	</rtc>
</ruby>
}}}
!Sample
{{{
前文<<ruby
	rbLang : 'zh-Hant'
	rbTextBefore: 'ㄓ,ㄩㄢˊ,ㄧㄣ,ㄅㄧㄠ,ㄒㄧㄢˇ,ㄕˋ'
	rbBase: '支援音標顯示'
	rbTextAfter: '眉批、附註'
>>後文
}}}
前文<<ruby
	rbLang : 'zh-Hant'
	rbTextBefore: 'ㄓ,ㄩㄢˊ,ㄧㄣ,ㄅㄧㄠ,ㄒㄧㄢˇ,ㄕˋ'
	rbBase: '支援音標顯示'
	rbTextAfter: '眉批、附註'
>>後文

{{{
<<ruby 'ㄓ,ㄩㄢˊ,ㄧㄣ,ㄅㄧㄠ,ㄒㄧㄢˇ,ㄕˋ' '支援音標顯示' '眉批、附註'>>
}}}
<<ruby 'ㄓ,ㄩㄢˊ,ㄧㄣ,ㄅㄧㄠ,ㄒㄧㄢˇ,ㄕˋ' '支援音標顯示' '眉批、附註'>>

!Revision History:
|''Version''|''Date''|''Note''|
|0.1.0|Jul 20, 2007|Fixed bug of ruby formatter|
|0.2.0|Jan 30, 2007|Added Xhtml Ruby formatter<br />Allowed anonymous params|
|0.1.0|Jan 29, 2007|Initial release|
!Code section:
***/
//{{{
version.extensions.ruby = {major: 0, minor: 3, revision: 0,
 date: new Date("Jan 30, 2007"),
 name: "ruby",
 type: "Plugin",
 author: "BramChen",
 source: "http://sourceforge.net/project/showfiles.php?group_id=150646"
};
config.shadowTiddlers['StyleRuby'] = '\
/*{{{*/\n\
ruby {display:ruby-base;}\n\
rbc {display:ruby-base-container; font-size:2em;}\n\
rb {display:ruby-base;}\n\
rtc.before {display:ruby-text-container; ruby-position:before; color:blue; font-size:1.5em;}\n\
rtc.after {display:ruby-text-container; ruby-position:after; color:red}\n\
rt {display:ruby-text; ruby-span:attr(rbspan);}\n\
/*}}}*/\
';
//# config.shadowTiddlers.StyleSheet += '[[StyleRuby]]';
config.macros.ruby = {
	style: 'StyleRuby',
	box: {
		ruby: '<html><style type="text/css">%0</style><ruby moz-ruby-vertical-position-corrected="true" style="vertical-align:-12px ! important;" moz-ruby-parsed="done" xml:lang="%1"><rbc>%2</rbc><rtc class="before">%3</rtc><rtc class="after">%4</rtc></ruby></html>',
//		ruby: '<html><style type="text/css">%0</style><ruby xml:lang="%1"><rbc>%2</rbc><rtc class="before">%3</rtc><rtc class="after">%4</rtc></ruby></html>',
		rb: '<rb>%0</rb>',
		rt: '<rt>%0</rt>',
		rta: '<rt rbspan="%0">%1</rt>'
	}}
config.macros.ruby.genNode = function(container,texts){
	var r = '';
	for (var i=0; i<texts.length; i++){
		r += this.box[container].format([texts[i]]);
	}
	return r;
}
config.macros.ruby.handler = function(place,macroName,params,wikifier,paramString,tiddler){
	params = paramString.parseParams("anon",null,true,false,true);
	var rbTextBefore = [], rbBase = '', rbTextAfter = '';
	var rbStyle =  (typeof params[0]['style'] == 'undefined')?this.style:params[0]['style'].toString();
	 	rbStyle = store.getTiddlerText(rbStyle);
	var rbLang = (typeof params[0]['rbLang'] == 'undefined')?'en':params[0]['rbLang'].toString();
	if (params[1] && params[1].name == "anon"){
		if (params[0]['anon'].length > 2){
			rbTextBefore = params[1].value.split(',');
			rbBase = params[2].value;
			rbTextAfter = params[3].value;
		}
		else {
			wikify('@@XhtmlRuby param error!@@',place);
			return false;
		}
	}
	rbTextBefore = (typeof params[0]['rbTextBefore'] == 'undefined')?rbTextBefore:params[0]['rbTextBefore'].toString().split(',');
	rbBase = (typeof params[0]['rbBase'] == 'undefined')?rbBase:params[0]['rbBase'].toString();
	rbTextAfter = (typeof params[0]['rbTextAfter'] == 'undefined')?rbTextAfter:params[0]['rbTextAfter'].toString();
	var rb = this.genNode('rb',rbBase);
	var rt = this.genNode('rt',rbTextBefore);
	var rta =this.box['rta'].format([rbBase.length,rbTextAfter]);
	var rbGroup = this.box.ruby.format([rbStyle,rbLang,rb,rt,rta]);	
	wikify(rbGroup,place);
}
//}}}
/***
!XhtmlRubyFormatter
***/
//{{{
config.formatters.push({
	name: "ruby",
	match: "<[Rr][Uu][Bb][Yy]>",
	lookaheadRegExp: /<[Rr][Uu][Bb][Yy]>((?:.|\n)*?)<\/[Rr][Uu][Bb][Yy]>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			createTiddlyElement(w.output,"span").innerHTML = '<' + 'ruby moz-ruby-vertical-position-corrected="true" style="vertical-align:-12px ! important;" moz-ruby-parsed="done">'+lookaheadMatch[1] + '</ruby>';
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
})

//}}}