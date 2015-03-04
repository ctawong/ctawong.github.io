/**
 * 
 */

////////////////// algorithms
function solve(){
	d3.select("#message")
		.text("Solving...");
	//displayMatrix(mapData);
	uniqueColors = unique(mapData, -1); // exclude -1
	if (uniqueColors.length == 0) return;

	var queue = [];
	
	// start with first unique color, find all valid paths
	var color = uniqueColors[0];
	pos = getColorPositions(mapData, color);
	var paths = allPossiblePaths(color, pos[0], mapData);
	for (var i=0; i<paths.length; i++){
		var current = new pathNode(paths[i]);
		current.color = color;
		current.map = deepCopyMap(mapData);
		updateMap(current.map, current.path, current.color);
		queue.push(current);  // queue each valid path
	}

	while (queue.length > 0) {
		var current = queue.pop();
		var colorInd = uniqueColors.indexOf(current.color);
		if (colorInd < uniqueColors.length-1){
			// do next color
			var color = uniqueColors[colorInd+1];
			pos = getColorPositions(current.map, color);
			var paths = allPossiblePaths(color, pos[0], current.map);
			for ( var i = 0; i < paths.length; i++) {
				var next = new pathNode(paths[i]);
				next.color = color;
				next.parent = current;
				next.map = deepCopyMap(current.map);
				updateMap(next.map, next.path, next.color);
				queue.push(next);
			} 
		} else {
			// current is the last color
			if (validSolution(current.map)){
				//displayMatrix(current.map);
				displaySolutionOnMap(current);
				d3.select("#message")
				.text("Solution found!  Press reset to contine.");				
				return;
			}
		} 
	}

	d3.select("#message")
	.text("No solution.");
	return;
}

function displaySolutionOnMap(pnode){
	while (true){
		// traverse and draw path for this color
		var current = pnode.path;
		var thisPos = current.value;
		var lastPos;
		while (true){
			lastPos = thisPos;
			var current = current.from;			
			thisPos = current.value;
			drawPath(lastPos, thisPos, pnode.color);
			if (current.from == undefined)
				break;
		}
		// go to last color
		pnode = pnode.parent;
		if (pnode == undefined)
			break;
	}
}




// check if the map is a valid solution (does not contain -1)
function validSolution(map){
	for (var r = 0; r<map.length; r++){
		if (map[r].indexOf(-1) != -1)
			return false;
	}
	return true;
}

// update map 
function updateMap(map, node, color){
	current = node;
	while (true){
		var pos = current.value;
		var r = pos[0];
		var c = pos[1];
		map[r][c] = color;
		current = current.from;
		if (current == undefined)
			break;
	}
	
}


// path node object
function pathNode(pnode){
	this.path = pnode;
	this.children = [];
	this.parent = undefined;
	this.color = undefined;
	this.map = undefined;
	
}


// node object
function node(value){
	this.value = value;
	this.children = [];
	this.from = undefined;
}


// return a new copy of 2D matrix map
function deepCopyMap(map){
	m = [];
	for (var r=0; r<map.length; r++){
		m[r] = [];
		for (var c=0; c<map.length; c++)
			m[r][c] = map[r][c];
	}
	return m;
}


// return a list of all possible paths (as the end node that can be traced back.)
function allPossiblePaths(color, startPos, map){	
	var validPaths = [];
	var pos, current, i;
	var queue = [new node(startPos)];  // Queue for nodes to be processed
	while (queue.length > 0){
		current = queue.pop();
		// examine all current neighbors
		nn = neighbors(map, current.value, [color, -1]);
		for (i = 0; i < nn.length; i++){
			if (!visited(current, nn[i])) {
				// not visited before.  A valid next step.
				var next = new node(nn[i]);
				next.from = current;
				queue.push(next);
				current.children.push(next);
				r = nn[i][0];
				c = nn[i][1];
				if (mapData[r][c] == color)
					validPaths.push(next);
			}
		}
	}
	return validPaths;
}

// return true if pos is visited before
function visited(current, pos){
	while (current.from != undefined){
		var parent = current.from;
		if (parent.value[0] == pos[0] && parent.value[1] == pos[1])
			return true;
		current = parent;
	}
	return false;
}



function walkThisColor(uniqueColors, ind, map){
	var color = uniqueColors[ind];
	var pos = getColorPositions(map, color);
	var startPos = pos[0];
	walk(startPos, [-1, color], map);
}


// return array of neighbors that have the colors in "include" as neigbors
function neighbors(map, pos, include){
	var nn = [];
	var r = pos[0];
	var c = pos[1];
	if (r > 0){
		if (include.indexOf(map[r-1][c]) != -1)
			nn.push([r-1,c]);		
	}
	if (r < map.length-1){
		if (include.indexOf(map[r+1][c]) != -1)
			nn.push([r+1,c]);		
	}
	if (c > 0){
		if (include.indexOf(map[r][c-1]) != -1)
			nn.push([r,c-1]);		
	}
	if (c < map[0].length){
		if (include.indexOf(map[r][c+1]) != -1)
			nn.push([r,c+1]);		
	}
	return nn;
}


// return positions of matrix that has element color
function getColorPositions(matrix, color){
	var pos = [];
	var r,c;
	for (r = 0; r < matrix.length; r++) {
		for (c = 0; c < matrix[0].length; c++) {
			if (matrix[r][c] == color)
				pos.push([r,c]);
		}
	}
	return pos;
}


// debugging function to display a matrix as table
function displayMatrix(matrix){
	var body = d3.select("body");
	var table = body.append("table");
	var tr = table.selectAll("tr")
	.data(matrix)
	.enter().append("tr");
	var td = tr.selectAll("td")
	.data(function(d) { return d; })
	.enter().append("td").text(function(d) { return d; });
	body.append("p")
}

// return unqiue elements of a 2D matrix, exclude the element specified in exclude
function unique(matrix, exclude) {
	var u = [];
	var r, c;
	for (r = 0; r < matrix.length; r++) {
		for (c = 0; c < matrix[0].length; c++) {
			if ( (u.indexOf(matrix[r][c]) == -1) && (exclude != matrix[r][c])){
				u.push(matrix[r][c]);
			}

		}
	}
	return u;
}

