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

function generateBoard(board) {
  //Clear previous board
  clearPrevious();
  //Let used to increment tile ids
  let idCount = 0;
  //Create 81 tiles
  for(let i = 0; i < 81; i++){
    //Create a new paragraph element
    let tile = document.createElement("p");
    //If tile is not supposed to be blank
    if(board.charAt(i) != "-"){
      //Set tile text to correct number
      tile.textContent = board.charAt(i);
    } else {
      //Add click event listener to tile
      tile.addEventListener("click", function() {
        //If selecting is not disabled
        if(!disableSelect) {
          //If the tile is already selected
          if(tile.classList.contains("selected")) {
            //Then remove selection
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            //Deselect all other tiles
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            // Add selection and update variable
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });                       
    }
    //Assign tile id
    tile.id = idCount;
    //Increment for next tile
    idCount++;
    //Add tile class to all tiles
    tile.classList.add("tile");
    if((tile.id > 17 && tile.id < 27) || (tile.id > 44 & tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    if((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6){
      tile.classList.add("rightBorder");
    }
    //Add tile to baord
    id("board").appendChild(tile);
  }
}

function updateMove(){
  // If a tile and a number is selected
  if(selectedTile && selectedNum){
    //Set the tile to the correct number
    selectedTile.textContent = selectedNum.textContent;
    // If the number matches the corresponding number in the solutions key
    if(checkCorrect(selectedTile)) {
      //Deselect the tile
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      //Clear the selected variables
      selectedNum = null;
      selectedTile = null;
      //Check if board is completed
      if (checkDone()) {
        endGame();
      }
      // If the number does not match the solution key
    } else {
      //Disable selecting new numbers for one second
      disableSelect = true;
      //Make the tile turn red
      selectedTile.classList.add("incorrect");
      //Run in one second
      setTimeout(function() {
        //Subtract lives by one
        mistakes++;
        //If no mistakes remaining end game
        if(mistakes === 3) {
          endGame();
        } else {
          //If mistkaes is not equal to zero
          //Update mistakes text
          id("mistakes").textContent = "Mistakes: " + mistakes + "/3";
          //Renable selecting numbers and tiles
          disableSelect = false;
        }
        // Restore tile colour and remove selected from both
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");
        //Clear the tiles text and clear seleceted variables
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;
      }, 1000);
    }
  }
}

function checkDone(){
  let tiles = qsa(".tile");
  for(let i = 0; i < tiles.length; i++) {
    if(tiles[i].textContent === "") return false;
  }
  return true;
}

function endGame(){
  //Disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);
  //Display win or loss message;
  if(mistakes === 3 || timeRemaining === 0) {
    id("mistakes").textContent = "You lost! Unlucky!";
  } else {
    id("mistakes").textConent = "You won!";
  }
}

function checkCorrect(tile){
  //Set solution based on difficulty selection
  let solution;
  if (id("diff-1").checked) solution = easy[1];
  else if (id("diff-2").checked) solution = medium[1];
  else if (id("diff-3").checked) solution = hard[1];
  else solution = expert[1];
  // If tile's number is equal to solution's number
  if(solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}

function clearPrevious() {
  //Access all of the tiles
  let tiles = qsa(".tile");
  //Remove each tile
  for(let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }
  //Clear the timer
  if(timer) clearTimeout(timer);
  //Deselect numbers
  for(let i = 0; i < id("number-container").children.length; i++){
    id("number-container").children[i].classList.remove("selected");
  }
  //Clear selected variables
  selectedTile = null;
  selectedNum = null;
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