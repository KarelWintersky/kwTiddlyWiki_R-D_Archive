/***
|''Name:''|CloseUnsavedOnCancel|
|''Version:''|2.0.8 (16-Apr-2006)|
|''Author:''|SimonBaird|
|''Adapted By:''|[[Jack]]|
|''Type:''|Plugin|
!Description
When you click new tiddler then click cancel I think the new tiddler should close automatically. This plugin implements that behaviour.

!Revision History
* 1.0.1 (11-Oct-2005) by SimonBaird
* 2.0.8 Made 2.0.x compatible by Jack on 16-Apr-2006

!Code
***/
//{{{

config.commands.cancelTiddler.handler = function(event,src,title) {
 if(story.hasChanges(title) && !readOnly)
 if(!confirm(this.warning.format([title])))
 return false;
 story.setDirty(title,false);
 if (!store.tiddlerExists(title) || store.fetchTiddler(title).modifier==config.views.wikified.defaultModifier) {
 story.closeTiddler(title,false);
 store.removeTiddler(title)
 } else {
 story.displayTiddler(null,title);
 }
 return false;
}

//}}}