var populationsize = 10; // default population size
var plotboard = {};
var points = [];
var history = [];
var historyboard = {};
var historygraph = "first";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function initpopulation(){
	document.getElementById("populationsetbuttonID").addEventListener("click",userinputpopulation);
	for(var i=0; i<populationsize; i++) {
	    points[i] = new Array(populationsize-1);
	}
	for (let i = 0; i < populationsize; i++) {
		for (let j = 0; j < populationsize; j++) {
			points[i][j] = plotboard.create("point", [i, j], {
				showInfobox: false,
				name: "",
				fixed: true,
				highlight: false,
				color: "blue",
			});
		}
	}
	//create one informed vertice
	var x = getRandomInt(populationsize);
	var y = getRandomInt(populationsize);
	points[x][y].setAttribute({color:"red"});

}

function userinputpopulation() {
	plotboard.suspendUpdate()
	for (let i = 0; i < populationsize; i++) {
		for (let j = 0; j < populationsize; j++) {
			plotboard.removeObject(points[i][j])
		}
	}
	populationsize = document.getElementById("population").value;
	plotboard.setBoundingBox([-1, populationsize, populationsize, -1]);
	for(var i=0; i<populationsize; i++) {
		points[i] = new Array(populationsize-1);
	}
	for (let i = 0; i < populationsize; i++) {
		for (let j = 0; j < populationsize; j++) {
			points[i][j] = plotboard.create("point", [i, j], {
				showInfobox: false,
				name: "",
				fixed: true,
				highlight: false,
				color: "blue",
			});
		}
	}
	//create one informed vertice
	var x = getRandomInt(populationsize);
	var y = getRandomInt(populationsize);
	points[x][y].setAttribute({color:"red"})
	plotboard.unsuspendUpdate();
}

function initboard(){
		plotboard = JXG.JSXGraph.initBoard('populationdivID', {
		boundingbox: [-1, populationsize, populationsize, -1],  
		axis: false,
		keepaspectratio: false,
		showCopyright: false,
		showNavigation: false,
		zoom: {
			enabled: false, 
			factorX: 1.25,
			factorY: 1.25,
			wheel: true,
			needshift: false,
			eps: 0.1,
		},
		pan: {
		  enabled: false,   // Allow panning
		  needTwoFingers: false, // panning is done with two fingers on touch devices
		  needShift: true, // mouse panning needs pressing of the shift key
		},
	});
}

function inithistoryboard(){
	historyboard = JXG.JSXGraph.initBoard('historyboarddivID', {
		boundingbox: [-0.5, populationsize, 5, -0.5],  
		axis: true,
		keepaspectratio: false,
		showCopyright: false,
		showNavigation: false,
		zoom: {
			factorX: 1.25,
			factorY: 1.25,
			wheel: true,
			needshift: false,
			eps: 0.1,
		},
		pan: {
		  enabled: true,   // Allow panning
		  needTwoFingers: false, // panning is done with two fingers on touch devices
		  needShift: true, // mouse panning needs pressing of the shift key
		},
	});
}

function updatehistoryboard(history) {
	if(historygraph != "first"){
		historyboard.removeObject(historygraph);
	}
	historyboard.setBoundingBox([-0.5, populationsize*populationsize, history.length, -0.5])
	var x = [];
	for (let i = 0; i < history.length; i++) {
		x.push(i);
	}
	historygraph = historyboard.create('curve', [x,history], {dash:2});
}

function initstart() {
	document.getElementById("startbuttonpush").addEventListener("click", startiterationpush);
	document.getElementById("startbuttonpull").addEventListener("click", startiterationpull);
	document.getElementById("startbuttonpp").addEventListener("click", startiterationpp);
}

function numberinformed(){
	var counter = 0;
	for (let i = 0; i < populationsize; i++) {
		for (let j = 0; j < populationsize; j++) {
			if(points[i][j].getAttribute("color") == "red") counter ++;
		}
	}
	return counter;
}

function numbernotinformed(){
	var counter = 0;
	for (let i = 0; i < populationsize; i++) {
		for (let j = 0; j < populationsize; j++) {
			if(points[i][j].getAttribute("color") == "blue") counter ++;
		}
	}
	return counter;
}

function startiterationpush() {
	if(numberinformed() !=1){
		userinputpopulation();
	}
	history = [];
	history.push(1);
	function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
	}

	var counter = numberinformed();
	async function iter(){
		var round = 1;
    while(counter < populationsize*populationsize) {
			await delay(1000);
			plotboard.suspendUpdate()	
			for(let i = 0; i <counter;i++){
				var x = getRandomInt(populationsize);
				var y = getRandomInt(populationsize);
				points[x][y].setAttribute({color:"red"});
			}
			plotboard.unsuspendUpdate()
			plotboard.fullUpdate();
			counter = numberinformed();
			history.push(counter);
			document.getElementById("iterationnumberdivID").innerHTML = "Round:" + round +"&nbsp;&nbsp;&nbsp;&nbsp;" + " informed:" + counter;
			round++;
		}
		updatehistoryboard(history);
	}
	iter();	
}

function startiterationpull(){
	if(numberinformed() !=1){
		userinputpopulation();
	}
	history = [];
	history.push(1);
	function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
	}
	
	var counter = numberinformed();
	var listtoinform = [];
	async function iter(){
		var round =1;
		while(counter < populationsize*populationsize){
			await delay(1000);
			listtoinform = [];
			plotboard.suspendUpdate();
			for (let i = 0; i < populationsize; i++) {
				for (let j = 0; j < populationsize; j++) {
					if(points[i][j].getAttribute("color") == "blue"){
						var x = getRandomInt(populationsize);
						var y = getRandomInt(populationsize);
						if(points[x][y].getAttribute("color") == "red"){
							listtoinform.push(points[i][j]);
						}
					}
				}			
			}
			for (let i = 0; i < listtoinform.length; i++) {
				listtoinform[i].setAttribute({color:"red"});
			}
			plotboard.unsuspendUpdate()
			plotboard.fullUpdate();
			counter = numberinformed();
			history.push(counter);
			document.getElementById("iterationnumberdivID").innerHTML = "Round:" + round +"&nbsp;&nbsp;&nbsp;&nbsp;" + " informed:" + counter;
			round++;
		}
		updatehistoryboard(history);
	}
	iter();	
}

function startiterationpp(){
	if(numberinformed() !=1){
		userinputpopulation();
	}
	history = [];
	history.push(1);
	function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
	}

	var counter = numberinformed();
	var listtoinform =[];
	async function iter(){
		var round = 1;
		while(counter < populationsize*populationsize){
			await delay(1000);
			listtoinform = [];
			plotboard.suspendUpdate();
			for (let i = 0; i < populationsize; i++) {
				for (let j = 0; j < populationsize; j++) {
					if(points[i][j].getAttribute("color") == "blue"){
						var x = getRandomInt(populationsize);
						var y = getRandomInt(populationsize);
						if(points[x][y].getAttribute("color") == "red"){
							listtoinform.push(points[i][j]);
						}
					}else{
						var x = getRandomInt(populationsize);
						var y = getRandomInt(populationsize);
						listtoinform.push(points[x][y]);
					}
				}			
			}
			for (let i = 0; i < listtoinform.length; i++) {
				listtoinform[i].setAttribute({color:"red"});
			}
			plotboard.unsuspendUpdate()
			plotboard.fullUpdate();
			counter = numberinformed();
			history.push(counter);
			document.getElementById("iterationnumberdivID").innerHTML = "Round:" + round +"&nbsp;&nbsp;&nbsp;&nbsp;" + " informed:" + counter;
			round++;
		}
		updatehistoryboard(history);
	}
	iter();	
}


document.addEventListener('DOMContentLoaded', () => {
	initboard();
	inithistoryboard();
	initpopulation();
	initstart();
});