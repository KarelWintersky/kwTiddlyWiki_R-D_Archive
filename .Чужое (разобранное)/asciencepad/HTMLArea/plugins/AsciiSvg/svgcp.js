//set of functions for the SVG Grapher control panel
var gname = "";
var dopreview = false;

function addgraph() {
	
	var graphs = document.getElementById("graphs");
	var newopt = document.createElement('option');

	var type = document.getElementById("eqntype").value;
	var eq1 = document.getElementById("equation").value;
	var eq2 = null;

	if (type == "func") {
		newopt.text = 'y=' + eq1;
	} else if (type == "polar") {
		newopt.text = 'r=' + eq1;
	} else if (type == "param") {
		eq2= document.getElementById("eqn2").value;
		newopt.text = '[x,y]=[' + eq1 + ','+ eq2 + ']';
	} else if (type == "slope") {
		newopt.text = 'dy/dx='+eq1;
		eq2= document.getElementById("eqn2").value;

	} 		

	
	 m_gstart = document.getElementById("gstart").selectedIndex;
	 m_gend = document.getElementById("gend").selectedIndex;
	 m_color = document.getElementById("gcolor").value;
	 m_strokewidth = document.getElementById("strokewidth").value;
	 m_strokedash = document.getElementById("strokedash").value;
	 if (document.getElementById("xstart").value.length > 0) {
 		//newopt.value = 'myplot(' + eqn +',"' +m_gstart+  '","' + m_gend+'",' + document.getElementById("xstart").value + ',' + document.getElementById("xend").value  +');';
		newopt.value = type + ',' + eq1 + ',' + eq2 + ',' + m_gstart + ',' + m_gend + ',' + document.getElementById("xstart").value + ',' + document.getElementById("xend").value + ',' + m_color + ',' + m_strokewidth + ',' + m_strokedash;
          } else {
		//newopt.value = 'myplot(' + eqn + ',"' +m_gstart+  '","' + m_gend+'");';
		newopt.value = type + ',' + eq1 + ',' + eq2 + ',' + m_gstart + ',' + m_gend + ',,' + ',' + m_color + ',' + m_strokewidth + ',' + m_strokedash;
	 }
	
 
	graphs.options[graphs.options.length] = newopt;
	graphs.selectedIndex = graphs.options.length - 1;
	graphit();
	
}

function replacegraph() {
		var graphs = document.getElementById("graphs");
		if (graphs.selectedIndex >= 0) {
			graphs.options[graphs.selectedIndex] = null;  //standards compliant
		}
		addgraph();
}

function removegraph() {
		var graphs = document.getElementById("graphs");
		if (graphs.selectedIndex >= 0) {
			graphs.options[graphs.selectedIndex] = null;
			if (graphs.options.length > 0) {loadeqn();}
		}
		graphit();
}

function graphit() {
	var commands;
	commands = "";
     
	initialized = false;
	
	//commands = 'setBorder(5);';

	m_xmin = document.getElementById("xmin").value;
	m_xmax = document.getElementById("xmax").value;
	m_ymin = document.getElementById("ymin").value;
	m_ymax = document.getElementById("ymax").value;
        if (m_ymin == "") m_ymin = null
        if (m_ymax == "") m_ymax = null
	commands += m_xmin + ',' + m_xmax + ','+ m_ymin + ',' + m_ymax + ',';

	m_xscl = document.getElementById("xscl").value;
	m_yscl = document.getElementById("yscl").value;
        if (m_xscl == "") m_xscl = null
        if (m_yscl == "") m_yscl = null
	if (document.getElementById("labels").checked) {
		m_labels = '1';
	} else {
		m_labels = 'null';
	}

	if (document.getElementById("grid").checked) {
		m_grid = ',' + m_xscl + ',' + m_yscl;
	} else {
		m_grid = ',null,null';
	}
	commands += m_xscl + ',' + m_yscl + ',' + m_labels + m_grid;
      
	commands += ',' + document.getElementById("gwidth").value + ',' + document.getElementById("gheight").value;
	

	graphs = document.getElementById("graphs");
	for (i=0; i < graphs.length; i++) {
		commands += ',' + graphs.options[i].value;
	}
//alert(commands)
	if (dopreview) {
		parseShortScript(commands);
	}
	opener.defineGraph(commands,gname,document.getElementById("alignment").value);
}

function changetype() {
	var type = document.getElementById("eqntype").value;
	
	if (type == "func") {
		chgtext("eq1lbl","f(x)=");
		document.getElementById("equation").value = "sin(x)";
		chgtext("eq2lbl","");
		chgtext("eq2","");
		
	} else if (type == "polar") {
		chgtext("eq1lbl", "r(t)=");
		document.getElementById("equation").value = "t";
		chgtext("eq2lbl","");
		chgtext("eq2","");
		
	} else if (type == "param") {
		chgtext("eq1lbl", "f(t)=");
		chgtext("eq2lbl","g(t)= ");
		var newinput = document.createElement('input');
		newinput.type = "text";
		newinput.name = "eqn2";
		newinput.id = "eqn2";
		newinput.size = "15";
		newinput.value = "cos(t)";
		var cnode = document.getElementById("eq2");
		cnode.replaceChild(newinput,cnode.lastChild);
		document.getElementById("equation").value = "sin(t)";

	} else if (type == "slope") {
		chgtext("eq1lbl", "dy/dx (x,y) = ");
		document.getElementById("equation").value = "x*y";
		chgtext("eq2lbl","every ");
		var newinput = document.createElement('input');
		newinput.type = "text";
		newinput.name = "eqn2";
		newinput.id = "eqn2";
		newinput.size = "2";
		newinput.value = "1";
		var cnode = document.getElementById("eq2");
		cnode.replaceChild(newinput,cnode.lastChild);
		
	}
	document.getElementById("gstart").selectedIndex = 0;
	document.getElementById("gend").selectedIndex = 0;
	document.getElementById("xstart").value = "";
	document.getElementById("xend").value = "";
	document.getElementById("gcolor").selectedIndex = 0;
	document.getElementById("strokewidth").selectedIndex = 0;
	document.getElementById("strokedash").selectedIndex = 0;

}
function loadeqn() {
	graphs = document.getElementById("graphs");
	
	
	var sa = graphs.options[graphs.selectedIndex].value.split(",");
	
	if (sa[0] == "func") {
		document.getElementById("eqntype").selectedIndex = 0;
	} else if (sa[0] == "polar") {
		document.getElementById("eqntype").selectedIndex = 1;
	} else if (sa[0] == "param") {
		document.getElementById("eqntype").selectedIndex = 2;
	} else if (sa[0] == "slope") {
		document.getElementById("eqntype").selectedIndex = 3;
	} 
	changetype();
	document.getElementById("equation").value = sa[1];
	if ((sa[0] == "param")||(sa[0] == "slope")) {
		document.getElementById("eqn2").value = sa[2];
	}

	document.getElementById("gstart").selectedIndex = sa[3];
	document.getElementById("gend").selectedIndex = sa[4];
	document.getElementById("xstart").value = sa[5];
	document.getElementById("xend").value = sa[6];
	switch (sa[7]) {
		case "black": document.getElementById("gcolor").selectedIndex = 0; break;
		case "red": document.getElementById("gcolor").selectedIndex = 1; break;
		case "orange": document.getElementById("gcolor").selectedIndex = 2; break;
		case "yellow": document.getElementById("gcolor").selectedIndex = 3; break;
		case "green": document.getElementById("gcolor").selectedIndex = 4; break;
		case "blue": document.getElementById("gcolor").selectedIndex = 5; break;
		case "purple": document.getElementById("gcolor").selectedIndex = 6; break;
	}
	document.getElementById("strokewidth").selectedIndex = sa[8] - 1;
	switch (sa[9]) {
		case "2": document.getElementById("strokedash").selectedIndex = 1; break;
		case "5": document.getElementById("strokedash").selectedIndex = 2; break;
		case "5 2": document.getElementById("strokedash").selectedIndex = 3; break;
		case "7 3 2 3": document.getElementById("strokedash").selectedIndex = 4; break;
		default: document.getElementById("strokedash").selectedIndex = 0;
	}
}
		
function getsscr(text,graphname,alignment,showAS) {
	gname = graphname;
	
	if (showAS) {dopreview = true;}
	
	sa = text.split(",");
	document.getElementById("xmin").value = sa[0];
	document.getElementById("xmax").value = sa[1];
	document.getElementById("ymin").value = sa[2];
	document.getElementById("ymax").value = sa[3];
	document.getElementById("xscl").value = sa[4];
	document.getElementById("yscl").value = sa[5];

	if (sa[6] != "null") {
		document.getElementById("labels").checked = true;
	} else {
		document.getElementById("labels").checked = false;
	}
	if (typeof eval(sa[7]) == "number") {
		document.getElementById("grid").checked = true;
	} else {
		document.getElementById("grid").checked = false;
	}
	
	document.getElementById("gwidth").value = sa[9];
	document.getElementById("gheight").value = sa[10];
	
	document.getElementById("graphs").length = 0;
	
	var inx = 11;
	while (sa.length > inx+9) {
		var newopt = document.createElement('option');
		
		if (sa[inx]== "func") {
			newopt.text = 'y=' + sa[inx+1];
		} else if (sa[inx] == "polar") {
			newopt.text = 'r=' + sa[inx+1];
		} else if (sa[inx] == "param") {
			newopt.text = '[x,y]=[' + sa[inx+1] + ','+ sa[inx+2] + ']';
		} else if (sa[inx] == "slope") {
			newopt.text = 'dy/dx='+ sa[inx+1];
		}
		newopt.value = sa[inx]+','+sa[inx+1]+','+sa[inx+2]+','+sa[inx+3]+','+sa[inx+4]+','+sa[inx+5]+','+sa[inx+6]+','+sa[inx+7]+','+sa[inx+8]+','+sa[inx+9];
		graphs = document.getElementById("graphs");
		graphs.options[graphs.options.length] = newopt;
		//document.getElementById("graphs").add(newopt);
		inx += 10;
	}
	if (inx > 11) {
		loadeqn();
	}
	
	switch (alignment.toLowerCase()) {
		case "text-top": document.getElementById("alignment").selectedIndex = 0; break;
		case "middle": document.getElementById("alignment").selectedIndex = 1; break;
		case "text-bottom": document.getElementById("alignment").selectedIndex = 2; break;
		case "left": document.getElementById("alignment").selectedIndex = 3; break;
		case "right": document.getElementById("alignment").selectedIndex = 4; break;
		default: document.getElementById("alignment").selectedIndex = 0; break;
	}
	
	graphit();
}

function chgtext (tag,text)
{
  	var cnode = document.getElementById(tag);
	cnode.replaceChild(document.createTextNode(text),cnode.lastChild);
}

