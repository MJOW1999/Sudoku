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