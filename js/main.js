const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// Getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
   foodX = Math.floor(Math.random() * 30) + 1;
   foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
   // Clearing the timer and reloading the page on game over
   clearInterval(setIntervalId);
   alert("Game Over! Press OK to replay...");
   location.reload();
}

const changeDirection = (e) => {
   if ((e.key === "ArrowUp" || e.key === "w") && velocityY != 1) {
      velocityX = 0;
      velocityY = -1;
   } else if ((e.key === "ArrowDown" || e.key === "s") && velocityY != -1) {
      velocityX = 0;
      velocityY = 1;
   } else if ((e.key === "ArrowLeft" || e.key === "a") && velocityX != 1) {
      velocityX = -1;
      velocityY = 0;
   } else if ((e.key === "ArrowRight" || e.key === "d") && velocityX != -1) {
      velocityX = 1;
      velocityY = 0;
   }
}

controls.forEach(key => {
   // Callnig changeDirection on each key click and passing key dataset value as an object
   key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
})

const initGame = () => {
   if(gameOver) return handleGameOver();
   let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
   
   if(snakeX === foodX && snakeY === foodY) {
      snakeBody.push([foodX, foodY]);
      changeFoodPosition();
      score += 5;

      highScore = score >= highScore ? score : highScore;
      localStorage.setItem("high-score", highScore);
      scoreElement.innerText = `Score: ${score}`;
      highScoreElement.innerText = `High Score: ${highScore}`;
   }

   for (let i = snakeBody.length - 1; i > 0; i--) {
      // Shifting forward the values of the elements in the snake body by one
      snakeBody[i] = snakeBody[i - 1];
   }

   snakeBody[0] = [snakeX, snakeY];

   snakeX += velocityX;
   snakeY += velocityY;

   if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
      gameOver = true;
   }

   for (let i = 0; i < snakeBody.length; i++) {
      htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
      // Check body hit
      if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
         gameOver = true;
      }
   }

   playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);