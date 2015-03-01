"use strict";
var numCols = 5;
var numRows = 5;
var mapData = [];
var mapCoord = [];
var c,r;
var pixelSize = 40;
var squareSize = 36;
var padSize = (pixelSize - squareSize)/2;
var colorSelected = 0;

var colorButtonRadius =pixelSize/2 - 2; 
var colorButtons = [];
colorButtons[0] = {fill:"red", text: "A"};
colorButtons[1] = {fill:"rgb(200,200,255)", text: "B"};
colorButtons[2] = {fill:"yellow", text: "C"};
colorButtons[3] = {fill:"gold", text: "D"};
colorButtons[4] = {fill:"pink", text: "E"};
colorButtons[5] = {fill:"purple", text: "F"};

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

//creates map according to size of the game map
function initializeMap(){
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
		.attr("x",padSize)
		.attr("y",padSize);
	mapEntry.append("g")
		.attr("class", "holder");
}

// do after clicking submit button
function reset() {
    var x = document.getElementById("sizeInput").value;
    numCols = x;
    numRows = x;
    resetMapData(numRows, numCols);
    initializeMap();
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

// actions after clicking a map element
function clickMapElement(r, c){
	var elem = d3.select("g#map_"+r+"_"+c).select(".holder");
	if (mapData[r][c] == -1){
		// if the square clicked has nothing, add a circle
		elem.append("circle")
			.attr("cx", pixelSize/2)
			.attr("cy", pixelSize/2)
			.attr("r", colorButtonRadius)
			.attr("fill", colorButtons[colorSelected].fill);
		elem.append("text")
			.attr("x", pixelSize/2)
			.attr("y", pixelSize/2+2*padSize)  // to shift text label to center of circle
			.attr("text-anchor", "middle")
			.attr("fill", "black")
			.text(colorButtons[colorSelected].text);
		mapData[r][c] = colorSelected;
	} else {
		// if the square clicked already has a circle, remove it
		elem.select("circle").remove();
		elem.select("text").remove();
		mapData[r][c] = -1;
	}
	
}

// Main program
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