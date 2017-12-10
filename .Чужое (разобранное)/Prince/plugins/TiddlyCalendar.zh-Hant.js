//{{{
Calendar.locale = 'zh-Hant';
Calendar[Calendar.locale] = {
	dates: {
		days: ["日", "一","二", "三", "四", "五", "六"],
		yearFmt: "YYYY年",
		monthFmt: "YYYY年0MM月",
		dateFmt: "YYYY年0MM月0DD日",
		longHolidayFmt: "YYYY年0MM月0DD日",
		shortHolidayFmt: "0MM月0DD日",
		startOfWeek: 0, /* 0 (日)、1(一)*/
		weekends: [true, false, false, false, false, false, true], /* 預設: 0 (日) and 6 (六) true*/
		holidays: ['01月01日']}
};
var calendar = new Calendar(); 
var datepicker = new Calendar();
//}}}