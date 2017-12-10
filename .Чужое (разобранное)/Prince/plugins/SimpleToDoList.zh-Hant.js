/***
|''Name:''|SimpleToDoList.zh-Hant|
|''Source:''|[[TiddlyWiki-zh|http://tiddlywiki-zh.googlecode.com/svn/trunk/contributors/BramChen/locales/plugins/]]|
|''Requires:''|[[SimpleToDoList]]|
***/
//{{{
if (typeof config.macros.stlManager != "undefined"){
	merge(config.macros.stlManager,{
		wizardTitle: "",
		step1Title: "",
		step1Html: "<input type='hidden' name='markList'></input>", // DO NOT TRANSLATE
		confirmDeleteText: "確認是否刪所選項目:\n\n%0",
		deleteLabel: "刪除",
		deletePrompt: "永遠刪除所選項目",
		listViewTemplate: {
			columns: [
				{name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
				{name: 'Completed', field: 'completed', title: "完成？", tag: 'completed', type: 'stlTagCheckbox'},
				{name: 'Title', field: 'title', tiddlerLink: 'title', title: "項目", type: 'TiddlerLink'},
				{name: 'Text', field: 'text', title: '說明', type: 'WikiText'}
				],
			rowClasses: [
				]}
	});
}
if (typeof config.macros.simpleToDo != "undefined"){
	merge(config.macros.simpleToDo, {
		dateFormat: "YYYY年0MM月0DD日0hh:0mm",
		newLabel: "新增 ",
		houskeepingLabel: "清理",
		msg: {
			confirmDelete: "你確定要刪除所有已完成的工作嗎？",
			canceled: "已取消清理作業！",
			done: "完成清理動作!"
		}
	});
}
//}}}