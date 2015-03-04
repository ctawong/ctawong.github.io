"use strict";
var numCols = 5;
var numRows = numCols;
var mapData = [];
var mapCoord = [];
var c,r;
var pixelSize = 40;
var squareSize = 40;
var pathSize = 0.5;
var colorSelected = 0;


var colorButtonRadius =pixelSize/2 - 2; 
var colorButtons = [];
colorButtons[0] = {fill:"red", text: "A"};
colorButtons[1] = {fill:"rgb(200,200,255)", text: "B"};
colorButtons[2] = {fill:"yellow", text: "C"};
colorButtons[3] = {fill:"gold", text: "D"};
colorButtons[4] = {fill:"pink", text: "E"};
colorButtons[5] = {fill:"rgb(255,200,255)", text: "F"};
colorButtons[6] = {fill:"rgb(200,255,255)", text: "G"};
colorButtons[7] = {fill:"rgb(255,255,200)", text: "H"};


// initialize map
function resetMapData(numRows, numCols) {
	// map data
	mapData = [];
	for (r = 0; r < numRows; r++) {
		mapData[r] = [];
		for (c = 0; c < numCols; c++) {
			mapData[r][c] = -1;
		}
	}
	// map coordinate
	mapCoord = [];
	for (r = 0; r < numRows; r++) {
		mapCoord[r] = [];
		for (c = 0; c < numCols; c++) {
			mapCoord[r][c] = [r,c];
		}
	}

}

// create input size box and reset button
function initializeInput(){
	var input = d3.select("#input");
	input.selectAll("input").remove();
	input.selectAll("button").remove();
	input.append("input")
		.attr("type", "range")
		.attr("value", numCols)
		.attr("id", "sizeInput")
		.attr("min", 3)
		.attr("max", 12)
		.attr("onchange","showValue(this.value)")
		.attr("oninput","showValue(this.value)");
	input.append("button")
		.attr("onclick","reset()")
		.text("reset");	
	showValue(numCols);
}

function showValue(v){
	document.getElementById("range").innerHTML=v;
}

//creates map according to size of the game map
function initializeMap(){
	initializeInput();	
	// select svg map
	var map = d3.select(".map")
		.attr("width", numCols*pixelSize)
		.attr("height", numRows*pixelSize);
	// remove existing content
	map.selectAll("g").remove();
	// select and create rows
	var mapRow = map.selectAll("g")
		.data(mapCoord)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * pixelSize + ")"; });
	// hieratically create squares in each row 
	var mapEntry = mapRow.selectAll("g")
		.data(function(d) {return d;})
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(" + i * pixelSize + ",0)"; })
		.attr("cursor", "pointer")
		.attr("onmouseup", function(d,i) {return "clickMapElement("+d[0]+","+d[1]+")";})
		.attr("id", function(d){return "map_"+d[0]+"_"+d[1];});
	mapEntry.append("rect")
		.attr("width", squareSize)
		.attr("height", squareSize)
		.attr("class", "mapElement");
//		.attr("x",padSize)
//		.attr("y",padSize);
//	mapEntry.append("g");
//		.attr("class", "holder");
}

// do after clicking submit button
function reset() {
    var x = parseInt(document.getElementById("sizeInput").value);
    numCols = x;
    numRows = x;
    resetMapData(numRows, numCols);
    initializeMap();
	d3.select("#message")
	.text("");    
}

// draw color buttons
function initializeColorButtons(colorButtons, colorButtonRadius){
	var cb = d3.select(".colorButtons")
		.attr("width", colorButtons.length*pixelSize)
		.attr("height", pixelSize);
	var cbEntry = cb.selectAll("g")
		.data(colorButtons)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(" + i * pixelSize + ",0)"; })
		.attr("cursor", "pointer")
		.attr("onmouseup", function(d,i) {return "clickSelectColor("+i+")";})
		.attr("id", function(d,i){return "colorButton"+i;});
	
	cbEntry.append("circle")
		.attr("cx", pixelSize/2)
		.attr("cy", pixelSize/2)
		.attr("r", colorButtonRadius)
		.attr("fill", function(d){return d.fill;})
		.attr("stroke", "black")
		.attr("stroke-width", 0);
	
	cbEntry.append("text")
		.attr("x", pixelSize/2)
		.attr("y", pixelSize/2+5)  // to shift text label to center of circle
		.attr("text-anchor", "middle")
		.text(function(d){return d.text});
}

// select new color button i, unhighlight old and highlight new
function clickSelectColor(i){
	var buttonLast = d3.select("g#colorButton"+colorSelected);
	buttonLast.select("circle")
		.attr("stroke-width", 0);
	colorSelected = i;	
	var buttonSelected = d3.select("g#colorButton"+i);
	buttonSelected.select("circle")
		.attr("stroke-width", 3);
}

function setMapElement(r,c, color){
	var elem = d3.select("g#map_"+r+"_"+c); //.select(".holder");
	if (color == -1){
		elem.select("circle").remove();
		elem.select("text").remove();		
	} else {
		elem.append("circle")
			.attr("cx", pixelSize/2)
			.attr("cy", pixelSize/2)
			.attr("r", colorButtonRadius)
			.attr("fill", colorButtons[color].fill);
		elem.append("text")
			.attr("x", pixelSize/2)
			.attr("y", pixelSize/2+5)  // to shift text label to center of circle
			.attr("text-anchor", "middle")
			.attr("fill", "black")
			.text(colorButtons[color].text);
		
	}

}

// actions after clicking a map element
function clickMapElement(r, c){

	if (mapData[r][c] == -1){
		// if the square clicked has nothing, add a circle
		setMapElement(r,c, colorSelected);
		mapData[r][c] = colorSelected;
	} else if (mapData[r][c] != colorSelected){
		// Square has a circle already but change to different color
		setMapElement(r,c,-1);
		setMapElement(r,c, colorSelected);
		mapData[r][c] = colorSelected;
	} else {
		// if the square clicked already has a circle, remove it
		setMapElement(r,c, -1);
		mapData[r][c] = -1;
	}
	
}



// preset dataset
function preset(i){
	var r,c;
	switch(i){
		case 1:
			var newMapData = 
				[[-1, -1, 0, 1, 2],
				 [-1,-1,-1,-1,-1],
				 [0, -1, -1, 4, -1],
				 [-1, -1, -1, 3, 2],
				 [1, 4, -1, -1, 3]];
			break;
		case 2:
			var newMapData = 
				[[ 0, -1,  2, -1, -1,  5],
			       [ 1, -1,  0,  1, -1, -1],
			       [-1, -1, -1, -1, -1, -1],
			       [-1,  3,  4, -1, -1, -1],
			       [-1,  4, -1,  2,  3, -1],
			       [-1, -1, -1, -1, -1,  5]];
			break;
		case 4:
			var newMapData = 
				[[-1,-1,-1,-1,-1,5,4,1],
				[-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,4,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,3,-1,-1,-1],
				[-1,1,2,6,0,-1,-1,2],
				[-1,6,-1,-1,5,-1,-1,3],
				[-1,-1,-1,-1,-1,-1,-1,0]];	
			break;
		case 3:
			var newMapData = 
				[[4,-1,1,-1,1,2,-1],
				 [3,-1,6,-1,-1,5,-1],
				 [-1,-1,-1,-1,6,-1,-1],
				 [-1,-1,-1,-1,5,-1,2],
				 [4,0,3,-1,-1,-1,-1],
				 [-1,-1,-1,-1,-1,0,-1],
				 [-1,-1,-1,-1,-1,-1,-1]];
			break;

	}
	
	numCols = newMapData.length;
	numRows = numCols;
	//initializeInput();
	resetMapData(numRows, numCols);
    initializeMap();
	mapData = newMapData;
	for (r=0; r < numRows; r++){
		for (c=0; c < numCols; c++){
			setMapElement(r,c, mapData[r][c]);
		}
	}
	d3.select("#message")
	.text("");	
}

//draw path from lastPos to thisPos with color
function drawPath(lastPos, thisPos, color){
	
	if (lastPos[0] == thisPos[0]-1 && lastPos[1]==thisPos[1]){
		// go down
		drawDown(lastPos, color);
		drawUp(thisPos, color);
		//console.log(lastPos + "   " + thisPos + "  " + color + " D");
	} else if (lastPos[0] == thisPos[0]+1 && lastPos[1]==thisPos[1]){
		// go up
		drawUp(lastPos, color);
		drawDown(thisPos, color);
		//console.log(lastPos + "   " + thisPos + "  " + color + " U");
	} else if (lastPos[0] == thisPos[0] && lastPos[1]==thisPos[1]-1){
		// go right
		drawRight(lastPos, color);
		drawLeft(thisPos, color);
		//console.log(lastPos + "   " + thisPos + "  " + color + " R");
	} else if (lastPos[0] == thisPos[0] && lastPos[1]==thisPos[1]+1){
		// go left
		drawLeft(lastPos, color);
		drawRight(thisPos, color);
		//console.log(lastPos + "   " + thisPos + "  " + color + " L");
	}
}

function drawUp(pos, color){
	var elem = d3.select("g#map_"+pos[0]+"_"+pos[1]); //.select(".holder");
	elem.insert("rect", "circle")
		.attr("width", pathSize*pixelSize)
		.attr("height", (0.5+pathSize/2)*pixelSize)
		.attr("x", (1-pathSize)*0.5*pixelSize)
		.attr("y", 0.)
		.attr("fill", colorButtons[color].fill);		
}
function drawDown(pos,color){
	var elem = d3.select("g#map_"+pos[0]+"_"+pos[1]); //.select(".holder");
	elem.insert("rect", "circle")
		.attr("width", pathSize*pixelSize)
		.attr("height", (0.5+pathSize/2)*pixelSize)
		.attr("x", (1-pathSize)*0.5*pixelSize)
		.attr("y", 0.5*pixelSize)
		.attr("fill", colorButtons[color].fill);		
}
function drawLeft(pos,color){
	var elem = d3.select("g#map_"+pos[0]+"_"+pos[1]); //.select(".holder");
	elem.insert("rect", "circle")
		.attr("width", (0.5+pathSize/2)*pixelSize)
		.attr("height", pathSize*pixelSize)
		.attr("x", 0.)
		.attr("y", (1-pathSize)*0.5*pixelSize)
		.attr("fill", colorButtons[color].fill);			
}
function drawRight(pos,color){
	var elem = d3.select("g#map_"+pos[0]+"_"+pos[1]); //.select(".holder");
	elem.insert("rect", "circle")
		.attr("width", (0.5+pathSize/2)*pixelSize)
		.attr("height", pathSize*pixelSize)
		.attr("x", (0.5-pathSize/2)*pixelSize)
		.attr("y", (1-pathSize)*0.5*pixelSize)
		.attr("fill", colorButtons[color].fill);		
	
}

/////////////////// Main program
resetMapData(numRows, numCols);
initializeMap();
initializeColorButtons(colorButtons, colorButtonRadius);
clickSelectColor(colorSelected);
//// Example for modifying a table
//var matrix = mapData; 
//var table = d3.select(".mytable");
//var tr = table.selectAll("tr")
//.data(matrix)
//.enter().append("tr");
//var td = tr.selectAll("td")
//.data(function(d) { return d; })
//.enter().append("td").text(function(d) { return d; });

// Example for adding a table from 2d data
//var matrix = mapData; 
//var body = d3.select("body");
//var table = body.append("table");
//var tr = table.selectAll("tr")
//.data(matrix)
//.enter().append("tr");
//var td = tr.selectAll("td")
//.data(function(d) { return d; })
//.enter().append("td").text(function(d) { return d; });