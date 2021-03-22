//Load boards
const easy = [
  "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------", //Original board
  "685329174971485326234761859362574981549618732718293465823946517197852643456137298" // Answer key
];
const medium = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
  "---1--4----4-9--62---7---3-5------1-1--683---34--1------6-7--458-134---6-----6--1",
  "685132479734598162219764538568427913197683254342915687926871345851349726473256891"
];
const expert = [
  "----3------1-7694--8-9------4---1----28-9----------16-7--8-----------4-2-9--1-3--",
  "469138275351276948287945631946751823128693754573482169734829516815367492692514387"];

//Create key variables
var timer;
var timeRemaining;
var mistakes;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function(){
	id("start-btn").addEventListener("click", startGame);
	//Add event listener to each number and number container
	for(let i = 0; i < id("number-container").children.length; i++){
		id("number-container").children[i].addEventListener("click", function() {
			//If selecting is not selected is not disabled
			if(!disableSelect){
				//If number is already selected
				if(this.classList.contains("selected")){
					//Then remove selection
					this.classList.remove("selected");
					selectedNum = null;
				} else {
					//Deselect all other numbers
					for(let i = 0; i < 9; i++) {
						id("number-container").children[i].classList.remove("selected");
					}
					//Select it and update the selectedNum variable
					this.classList.add("selected");
					selectedNum = this;
					updateMove();
				}
			}
		})
	} 
}
function startGame(){
  //Choose difficulty
  let board;
  if(id("diff-1").checked) board = easy[0];
  else if(id("diff-2").checked) board = medium[0];
  else if(id("diff-3").checked) board = hard[0];
  else board = expert[0];
  //Set lives to 3
  mistakes = 0;
  disableSelect = false;
  id("mistakes").textContent = "Mistakes: 0/3";
  //Creates board
  generateBoard(board);
  //Start the timer
  startTimer();
  //Set Theme
  if(id("theme-1").checked){
    qs("body").classList.remove("dark");
  } else {
    qs("body").classList.add("dark");
  }
  //Show number container
  id("number-container").classList.remove("hidden");
}

function startTimer(){
  //Sets time remaining based on input
  if (id("time-1").checked) timeRemaining = 300; // 5 Minute game
  else if (id("time-2").checked) timeRemaining = 600; // 10 Minute game
  else if(id("time-3").checked) timeRemaining = 1200; // 20 Minute game
  else timeRemaining = 1800; // 30 Minute game
  //Sets timer for first second
  id("timer").textContent = timeConversion(timeRemaining);
  //Update timer every second
  timer = setInterval(function() {
    timeRemaining --;
    // If no time remaining end the game
    if (timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  }, 1000)
}
//Converts seconds into string of MM:SS format
function timeConversion(time) {
  let minutes = Math.floor(time/60);
  if(minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if(seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

//Helper Functions
function id(id){
  return document.getElementById(id);
}


function qs(selector) {
  return document.querySelector(selector);
}


function qsa(selector) {
  return document.querySelectorAll(selector);
}