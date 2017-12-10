/***
!Metadata:
|''Name:''|SimpleToDoList|
|''Description:''||
|''Version:''|1.1.1|
|''Date:''|Jul 6, 2008|
|''Source:''|http://sourceforge.net/project/showfiles.php?group_id=150646|
|''Author:''|BramChen (bram.chen (at) gmail (dot) com)|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License]]|
|''~CoreVersion:''|2.2.0|
|''Browser:''|Firefox 1.5+,IE6,Opera9|
!Usage:
Create a tiddler, named YourCheckList and text containing:
{{{
<<simpleToDo chkTodo YourCheckList>>
/%
''categories:''xAA,xBB,xCC,xDD,xEE,xZZ,completed
|!'Categorie|!Title,Tips,NewItemLabel|
|''xAA:''|01.TodoA,TipsToDoA,ItemA|
|''xBB:''|02.TodoB,TipsToDoB,ItemB|
|''...:''|...,...|
|''xZZ:''|99.Others,Others|
|''completed:''|V.Completed,Completed|
%/
}}}
!Revision History:
|''Version''|''Date''|''Note''|
|1.1.1|Jul 6, 2008|removed config.macros.simpleToDo.Houskeep, added doDelete selector|
|1.1.0|Jun 13, 2008|added config.macros.simpleToDo.Houskeep for deleting completed tasks.<br>added optional parameter, so that, the tooltip of each tab of {{{<<stlManager>>}}}, could be different from the label of new item.|
|1.0.0|Apr 16, 2007|Initial release|
!Code section:
***/

//{{{
version.extensions.simpleToDo = {major: 1, minor: 1, revision: 1, date: new Date("Jule 6, 2008")};

ListView.columnTypes.stlTagCheckbox = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var e = createTiddlyCheckbox(place,null,listObject[field],this.onChange);
			e.setAttribute("tiddler",listObject.title);
			e.setAttribute("tag",columnTemplate.tag);
		},
	onChange: function(e)
		{
			var tag = this.getAttribute("tag");
			var tiddler = this.getAttribute("tiddler");
			store.setTiddlerTag(tiddler,this.checked,tag);
			var tr = this.parentNode.parentNode;
			if (tr.previousSibling === null && tr.nextSibling === null)
				removeNode(tr.parentNode.parentNode);
			else
				removeNode(tr);
		}
};

config.macros.stlManager = {
	wizardTitle: "",
	step1Title: "",
	step1Html: "<input type='hidden' name='markList'></input>", // DO NOT TRANSLATE
	confirmDeleteText: "Are you sure you want to delete these items:\n\n%0",
	deleteLabel: "delete",
	deletePrompt: "Delete these tiddlers forever",
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
			{name: 'Completed', field: 'completed', title: "Completed?", tag: 'completed', type: 'stlTagCheckbox'},
			{name: 'Title', field: 'title', tiddlerLink: 'title', title: "Item", type: 'TiddlerLink'},
			{name: 'Text', field: 'text', title: 'Description', type: 'WikiText'}
			],
		rowClasses: [
			]}
}

config.macros.stlManager.handler = function(place,macroName,params,wikifier,paramString,tiddler){
	var wizard = new Wizard();
	wizard.createWizard(place,this.wizardTitle);
	wizard.addStep(this.step1Title,this.step1Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	listWrapper.setAttribute("refresh","macro");
	listWrapper.setAttribute("macroName",macroName);
	listWrapper.setAttribute("params",params);
	this.refresh(listWrapper,params);
}

config.macros.stlManager.refresh = function(listWrapper,params){
	var wizard = new Wizard(listWrapper);
	var selectedRows = [];
	ListView.forEachSelector(listWrapper,function(e,rowName) {
			if(e.checked)
				selectedRows.push(e.getAttribute("rowName"));
		});

	if (config.browser.isIE) removeChildren(listWrapper);
	var catTag=params[0], stlTag=params[1], theLists=[];
	var stlLists = store.getTaggedTiddlers(catTag);
	for(t=0; t<stlLists.length; t++) {
		theTiddler = stlLists[t];
		if (theTiddler.isTagged(stlTag)){
			theTiddler.completed = theTiddler.isTagged('completed');
			if((theTiddler.completed && catTag == "completed") || (!theTiddler.completed && catTag != "completed"))
				theLists.push(theTiddler);
		}
	}
	if(theLists.length != 0) {
		var listView = ListView.create(listWrapper,theLists,this.listViewTemplate,this.onSelectCommand);
		wizard.setValue("listView",listView);
		wizard.setButtons([
				{caption: config.macros.stlManager.deleteLabel, tooltip: config.macros.stlManager.deletePrompt, onClick: config.macros.stlManager.doDelete}
			]);
	}
}

config.macros.stlManager.doDelete = function(e)
{
	var wizard = new Wizard(this);
	var listView = wizard.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	if(rowNames.length == 0) {
		alert(config.messages.nothingSelected);
	} else {
		if(confirm(config.macros.stlManager.confirmDeleteText.format([rowNames.join(", ")]))) {
			for(var t=0; t<rowNames.length; t++) {
				store.removeTiddler(rowNames[t]);
				story.closeTiddler(rowNames[t],true);
			}
		}
	}
	return false;
};

config.macros.simpleToDo = {
	dateFormat: config.views.wikified.dateFormat,
	newLabel: "New "
};

config.macros.simpleToDo.handler = function(place,macroName,params,wikifier,paramString,tiddler){
	var stlTag=params[0], stlDefs=params[1] || tiddler.title, categories={};
	var catNames = store.getTiddlerSlice(stlDefs,'categories');
	catNames = catNames?catNames.split(','):[];
	for (var i=0; i<catNames.length ; i++){
		var catName = catNames[i];
		if (catNames[i] != 'categories'){
			var cat = store.getTiddlerSlice(stlDefs,catNames[i]);
			if (cat) categories[catNames[i]] = cat;
		}
	}
	var t = '<<tabs txt'+stlTag;
	for(var i in categories){
		var theCat = categories[i].split(",");
		theCat[1]=theCat[1] || theCat[0];
		theCat[2]=theCat[2] || theCat[1];
		config.shadowTiddlers[theCat[0]] = (i == 'completed') ? "" :
			"<<newJournal '"+ this.dateFormat + "' label:'"+config.macros.simpleToDo.newLabel+theCat[2]+"' focus:title tag:"+stlTag+" " +i+">>\n";
		config.shadowTiddlers[theCat[0]] += "<<stlManager '" + i + "' '" + stlTag + "'>>";
		t += " " + theCat[0] + " '" + theCat[1] + "' '" + theCat[0]+"'";
	}
	t += '>>';
	wikify(t,place);
};
//}}}