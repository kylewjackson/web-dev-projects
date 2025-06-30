const setUp = {};
const color = {};

let numSquares = 6;
let colors = [];
let pickedColor;

const squares = document.querySelectorAll('.square');
const colorDisplay = document.getElementById('colorDisplay');
const messageDisplay = document.querySelector('#message');
const h1 = document.querySelector('h1');
const resetButton = document.querySelector('#reset');
const modeButtons = document.querySelectorAll('.mode');

//mode button even listeners
setUp.modeButtons = function() {
	for (let i = 0; i < modeButtons.length; i++) {
		modeButtons[i].addEventListener('click', function(){
			modeButtons[0].classList.remove('selected');
			modeButtons[1].classList.remove('selected');
			this.classList.add('selected');
			this.textContent === 'Easy' ? numSquares = 3 : numSquares = 6;
			setUp.reset();
		});
	}
}

setUp.squares = function() {
	for (let i = 0; i < squares.length; i++) {
		//add click event listeners to squares
		squares[i].addEventListener('click', function(){
			
			//add color of clicked square
			let clickedColor = this.style.backgroundColor;

			//compare color to pickedColor
			if (clickedColor === pickedColor) {
				messageDisplay.textContent = 'Correct!';
				resetButton.textContent = 'Play Again?';
				color.change(clickedColor);
				h1.style.backgroundColor = clickedColor;
			} else {
				this.style.backgroundColor = '#232323';
				messageDisplay.textContent = 'Try Again';
			}
		})
	};
}

color.pick = function() {
	let random = Math.floor(Math.random() * colors.length);
	return colors[random];
};

setUp.random = function() {
	let rgb = { //pick a red, green, and blue from 0 - 255
		red: Math.floor(Math.random() * 256),
		green: Math.floor(Math.random() * 256),
		blue: Math.floor(Math.random() * 256)
	}

	return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
};

color.generateRandom = function(num) {
	//make an array
	let arr = [];

	//add num random colors to array
	for (let i = 0; i < num; i++) {
		//get random color and push into array
		arr.push(setUp.random());
	}

	//return array
	return arr;
};

color.change = function(color) {
	//loop through all squares
	for (let i = 0; i < squares.length; i++) {
		//change colors to match given color
		squares[i].style.backgroundColor = color;
	}
};

setUp.reset = function() {
	//generate all new colors
	colors = color.generateRandom(numSquares);
	//pick a new random color from array
	pickedColor = color.pick();
	//change colorDisplay to match pickedColor
	colorDisplay.textContent = pickedColor;

	messageDisplay.textContent = '';
	//change colors of squares
	for (let i = 0; i < squares.length; i++) {
		if (colors[i]) {
			squares[i].style.display = 'block';
			squares[i].style.backgroundColor = colors[i];
		} else {
			squares[i].style.display = 'none';
		}
	}
	//change reset button text, and h1 bg color
	resetButton.textContent = 'New Colors';
	h1.style.backgroundColor = 'steelblue';	
}

resetButton.addEventListener('click', function(){
	setUp.reset();
});

function init() {
	//mode button even listeners
	setUp.modeButtons();

	setUp.squares();

	setUp.reset();
}

init();
