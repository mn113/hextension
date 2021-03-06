/***************/
/*! GAME SETUP */
/***************/
var tiles = {
	x: [1,5,9],			// mice, goldfish, ferrets?
	y: [3,4,8],			// water, oj, coffee?
	z: [2,6,7]			// oil, gas, sewage?
};

/* Board layout:
       __
    __/31\__    
 __/21\__/41\__ 
/11\__/32\__/51\
\__/22\__/42\__/
/12\__/33\__/52\
\__/23\__/43\__/
/13\__/34\__/53\
\__/24\__/44\__/
   \__/35\__/   
      \__/     
*/

var tileCount = 0;

var boardCoords = new Array(11,12,13,21,22,23,24,31,32,33,34,35,41,42,43,44,51,52,53);

var p = {		// could be combined with boardCoords
	11: {val: [0,0,0], nb: [21,22,12]},
	12: {val: [0,0,0], nb: [11,22,23,13]},
	13: {val: [0,0,0], nb: [12,23,24]},
	21: {val: [0,0,0], nb: [11,22,32,31]},
	22: {val: [0,0,0], nb: [21,32,33,23,12,11]},
	23: {val: [0,0,0], nb: [22,33,34,24,13,12]},
	24: {val: [0,0,0], nb: [13,23,34,35]},
	31: {val: [0,0,0], nb: [21,32,41]},
	32: {val: [0,0,0], nb: [31,41,42,33,22,21]},
	33: {val: [0,0,0], nb: [32,42,43,34,23,22]},
	34: {val: [0,0,0], nb: [33,43,44,35,24,23]},
	35: {val: [0,0,0], nb: [24,34,44]},
	41: {val: [0,0,0], nb: [31,32,42,51]},
	42: {val: [0,0,0], nb: [41,32,33,43,52,51]},
	43: {val: [0,0,0], nb: [42,33,34,44,53,52]},
	44: {val: [0,0,0], nb: [35,34,43,53]},
	51: {val: [0,0,0], nb: [41,42,52]},
	52: {val: [0,0,0], nb: [51,42,43,53]},
	53: {val: [0,0,0], nb: [44,43,52]}
}

/* Scoring axes:
	x = vertical (1,5,9)
	y = rising left (3,4,8)
	z = rising right (2,6,7)
*/

/*var scoreLines = {	// unnecessary, as hard-coded into score-summing function
	x1: [11,12,13],
	x2: [21,22,23,24],
	x3: [31,32,33,34,35],
	x4: [41,42,43,44],
	x5: [51,52,53],
		y1: [31,41,51],
		y2: [21,32,42,52],
		y3: [11,22,33,43,53],
		y4: [12,23,34,44],
		y5: [13,24,35],
			z1: [11,21,31],
			z2: [12,22,32,41],
			z3: [13,23,33,42,51],
			z4: [24,34,43,52],
			z5: [35,44,53]
}
*/

/******************/
/*! GENERATE GAME */
/******************/
function genTiles() {
	// Generate the 27 tiles:
	for (var a=0, xl=tiles.x.length; a < xl; a++) {
		for (var b=0, yl=tiles.y.length; b < yl; b++) {
			for (var c=0, zl=tiles.z.length; c < zl; c++) {
				var tileID = ''+ tiles.x[a] + tiles.y[b] + tiles.z[c];
				//console.log(tileID);

				// Make a random position for it:
				// (needs some separation)
				var trand = Math.floor(110 + 400*Math.random());
				var lrand = Math.floor(110 + 400*Math.random());

				// Create the html element:
				var tile = new Element('div', {
				    'id': 't'+tileID,
				    'class': 'tile',
				    'styles': {
				        'background': 'url(img/tiles/'+tileID+'.png)',
				        'top': trand+'px',
				        'left': lrand+'px'
				    }
				});

				//  Insert into document:
				var bank = $('bank');
				tile.inject(bank, 'bottom');

				var gamearea = $('gamearea');

				// Set up draggability:
				var tileDrag = new Drag.Move(tile, {
					droppables: $$('#board .place.valid'), // $('bank')
					container: gamearea,
					//handle: dragHandle,	// might need to define hexagon shape
					precalculate: true,		// improves performance
					snap: 10,
					onDrop: function(element, droppable) {

						if (!droppable) {
							//tileDrag.stop();
							springBack(element);							
						}		
						// If dropped on board place:	            
			            else if (droppable.hasClass('place valid')) {
			                // Remove draggability:
							//tileDrag.stop();
							tile.removeClass('current');
			            	// Drop it:
				            console.log(element.get('id')+' dropped into '+droppable.get('id'));
			                element.inject(droppable);
							// Store the tile's values:
							storeTile(element,droppable);				                
						}
						else {
							// Return element to bay:
							//tileDrag.stop();
							springBack(element);
						}
						// Zero tile position whether in bay or in board place:
			            element.setStyles({
						    'top': 0,
						    'left': 0
						});		
					},
		            onComplete: function(el) {
						//console.log(el.get('id')+' drag complete');
						//springBack(element);		            	
					}
				});
			}
		}
	}
}

function genBoard() {
	for (var a=0, t=boardCoords.length; a < t; a++) {	// FOR (A IN BOARDCOORDS)?
		var placeID = boardCoords[a];
		// Create html element:
		var place = new Element('div', {
		    'id': 'p'+placeID,
		    'class': 'place valid',
		});		
		//  Insert into document:
		place.inject($('board'), 'bottom');	
	}
}


/*******************/
/*! PLAY FUNCTIONS */
/*******************/
function chooseTile() {
	var tiles = $$('#bank .tile');
	var myTile = tiles.getRandom();
	console.log(myTile);
	// Transfer chosen tile to the bay & make fully draggable:
	myTile.inject($('bay'), 'top')
		  .addClass('current')
		  .setStyles({
			'top':'10px',
			'left':'4px'
		  });
}

function storeTile(element,droppable) {
	var values = element.get('id').substr(1,3);		// e.g. 132
	var location = droppable.get('id').substr(1,2); // e.g. 53
	console.log("Attempt to store "+values[0]+", "+values[1]+" and "+values[2]+" in "+location);
	for (var i=0; i<3; i++) {
		p[location].val[i] = parseInt(values[i]);	// CORRECTLY ACCESSED?
	}
	calcScore();
	tileCount++;
	if (tileCount < 19) chooseTile();
	filledPlaces.push(parseInt(location));
	findValidPlaces();
}

var validPlaces = new Array();
var filledPlaces = new Array();	// add to it each turn

function findValidPlaces() {
	if (tileCount > 0) {	// all valid on first turn
		// Remove all valid classes:
		$$('#board .place').removeClass('valid');
		
		var fl = filledPlaces.length;
		// Combine all the sets of neighbours					// USE .each FUNCTION MORE HERE; OR FOR...IN
		for (var i=0; i < fl; i++) {
			validPlaces.combine(p[filledPlaces[i]]['nb']);
		}
		// Then erase the already filled places
		for (var i=0; i < fl; i++) {
			validPlaces.erase(filledPlaces[i]);
		}
		var vl = validPlaces.length;
		// Convert the locations (e.g. '11') to HTML elements (<div id="p11"...)
		for (var i=0; i < vl; i++) {
			$('p'+validPlaces[i]).addClass('valid');
		}
	}
//	console.log("Valid places:");
//	console.log(validPlaces);
}

function springBack(tile) {
	var animation = new Fx.Morph(tile,{duration: 300});
	animation.start({'top': 0, 'left': 0});
	console.log('Sproing!');
}

/************/
/*! SCORING */
/************/
var scores = {
	x1:0, x2:0, x3:0, x4:0, x5:0,
	y1:0, y2:0, y3:0, y4:0, y5:0,
	z1:0, z2:0, z3:0, z4:0, z5:0
}

var totalScore = 0;

function calcScore() {

	// Zero any incomplete scoreLines:
	scores.x1 = (p[11].val[0] == p[12].val[0] && p[12].val[0] == p[13].val[0]) ? p[11].val[0] + p[12].val[0] + p[13].val[0] : 0;	// sum the line if all equal
	scores.x2 = (p[21].val[0] == p[22].val[0] && p[22].val[0] == p[23].val[0] && p[23].val[0] == p[24].val[0]) ? p[21].val[0] + p[22].val[0] + p[23].val[0] + p[24].val[0] : 0;
	scores.x3 = (p[31].val[0] == p[32].val[0] && p[32].val[0] == p[33].val[0] && p[33].val[0] == p[34].val[0] && p[34].val[0] == p[35].val[0]) ? p[31].val[0] + p[32].val[0] + p[33].val[0] + p[34].val[0] + p[35].val[0] : 0;
	scores.x4 = (p[41].val[0] == p[42].val[0] && p[42].val[0] == p[43].val[0] && p[43].val[0] == p[44].val[0]) ? p[41].val[0] + p[42].val[0] + p[43].val[0] + p[44].val[0] : 0;
	scores.x5 = (p[51].val[0] == p[52].val[0] && p[52].val[0] == p[53].val[0]) ? p[51].val[0] + p[52].val[0] + p[53].val[0] : 0;

	scores.y1 = (p[31].val[1] == p[41].val[1] && p[41].val[1] == p[51].val[1]) ? p[31].val[1] + p[41].val[1] + p[51].val[1] : 0;
	scores.y2 = (p[21].val[1] == p[32].val[1] && p[32].val[1] == p[42].val[1] && p[42].val[1] == p[52].val[1]) ? p[21].val[1] + p[32].val[1] + p[42].val[1] + p[52].val[1] : 0;
	scores.y3 = (p[11].val[1] == p[22].val[1] && p[22].val[1] == p[33].val[1] && p[33].val[1] == p[43].val[1] && p[43].val[1] == p[53].val[1]) ? p[11].val[1] + p[22].val[1] + p[33].val[1] + p[43].val[1] + p[53].val[1] : 0;
	scores.y4 = (p[12].val[1] == p[23].val[1] && p[23].val[1] == p[34].val[1] && p[34].val[1] == p[44].val[1]) ? p[12].val[1] + p[23].val[1] + p[34].val[1] + p[44].val[1] : 0;
	scores.y5 = (p[13].val[1] == p[24].val[1] && p[24].val[1] == p[35].val[1]) ? p[13].val[1] + p[24].val[1] + p[35].val[1] : 0;

	scores.z1 = (p[11].val[2] == p[21].val[2] && p[21].val[2] == p[31].val[2]) ? p[11].val[2] + p[21].val[2] + p[31].val[2] : 0;
	scores.z2 = (p[12].val[2] == p[22].val[2] && p[22].val[2] == p[32].val[2] && p[32].val[2] == p[41].val[2]) ? p[12].val[2] + p[22].val[2] + p[32].val[2] + p[41].val[2] : 0;
	scores.z3 = (p[13].val[2] == p[23].val[2] && p[23].val[2] == p[33].val[2] && p[33].val[2] == p[42].val[2] && p[42].val[2] == p[51].val[2]) ? p[13].val[2] + p[23].val[2] + p[33].val[2] + p[42].val[2] + p[51].val[2] : 0;
	scores.z4 = (p[24].val[2] == p[34].val[2] && p[34].val[2] == p[43].val[2] && p[43].val[2] == p[52].val[2]) ? p[24].val[2] + p[34].val[2] + p[43].val[2] + p[52].val[2] : 0;
	scores.z5 = (p[35].val[2] == p[44].val[2] && p[44].val[2] == p[53].val[2]) ? p[35].val[2] + p[44].val[2] + p[53].val[2] : 0;


	console.log("Scores:");
	console.log("x: "+scores.x1+', '+scores.x2+', '+scores.x3+', '+scores.x4+', '+scores.x5);
	console.log("y: "+scores.y1+', '+scores.y2+', '+scores.y3+', '+scores.y4+', '+scores.y5);
	console.log("z: "+scores.z1+', '+scores.z2+', '+scores.z3+', '+scores.z4+', '+scores.z5);

	// Reset and re-tally score:
	totalScore = 0;
	for (var i in scores) {
		totalScore += scores[i];
	}
					 
	// Display on screen:
	$('score').set('text', totalScore);
}


/*************/
/*! DOMREADY */
/*************/
// Mootools document ready:
window.addEvent('domready', function() {

	genBoard();
	genTiles();
	calcScore();
	chooseTile();

});
