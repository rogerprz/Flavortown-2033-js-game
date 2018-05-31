
const USERS_URL = 'http://localhost:3000/api/v1/users';
const DODGER = document.getElementById('dodger');
const GAME = document.getElementById('game');
const START = document.getElementById('start')
const OVERLAY = document.getElementById("overlay")
const PAUSE = document.getElementById("pause")
const HIGH_SCORE = document.getElementById('high-scores')
const SCORE_DISPLAY = document.getElementById("score")
const GAME_HEIGHT = 600;
const GAME_WIDTH = window.innerWidth;
const UP_ARROW = 38 ;// use e.which!
const DOWN_ARROW = 40; // use e.which!
const RIGHT_ARROW = 39;
const LEFT_ARROW = 37

const ROCKS = []
let MECHA_SIZE =40
let FIERI_SIZE = 30
let GUY_SPEED = 4
let ROCK_SPEED = null
let stopMotion = false;
let rockGenerateTime = 1100
let score = 0;
var gameInterval = null;
var additionalGuys = [];
const impactLocation = GAME_WIDTH-FIERI_SIZE-MECHA_SIZE;

const topScoreDisplay = document.getElementById("high-scores");
topScoreDisplay.style.visibility = "hidden";
const instructionsDisplay = document.getElementById("instructions");
instructionsDisplay.style.visibility = "hidden";

instructionsDisplay.addEventListener("click", function(e){
  toggleInstructions();
})



function speedIncrease() {
  if (GUY_SPEED < 5 && GUY_SPEED !== null) {
    console.log(`The speed is now ${GUY_SPEED}`)
     ++GUY_SPEED
   }
    else if (GUY_SPEED >= 5 && GUY_SPEED < 9) {
    ++GUY_SPEED;
    console.log(`The speed is now ${GUY_SPEED}`)
    additionalGuys.push(setInterval(function() {
         console.log('it added another rock, i think?')
         createRock(Math.floor(Math.random() *  (GAME_HEIGHT - 20))) }, 1800));

    }
  }



  // GET request for high scores
  fetch(USERS_URL)
  .then(response => response.json())
  .then(json=> highScore(json))

  function highScore (array) {
    let sortScores = [...array].sort((a,b)=>{
      return b.scores[0].score - a.scores[0].score;
    })
    for (let i =0;i<5;i++){
      tr = document.createElement('tr')
      let obj =sortScores[i]
      tr.innerHTML = `<th>${obj.name} </th>
      <th>${obj.scores[0].score}</th>`
      HIGH_SCORE.append(tr)
    }
  }
  // END of high scores


  //Start Game

  function start() {
    window.addEventListener('keydown', moveDodger);
    bgLoop();
    OVERLAY.style.display = "none";
    PAUSE.style.display="block"
    SCORE_DISPLAY.style.display = "block"
    gameInterval = setInterval(function() {
      createRock(Math.floor(Math.random() *  (GAME_HEIGHT - 20)))
    }, rockGenerateTime)
    ROCK_SPEED = setInterval(speedIncrease, 2000)
  }
  // End Start


//Game movement functions
  function checkCollision(rock) {
    const right = positionToInteger(rock.style.right);
    rock.style.right = right

    GAME.appendChild(rock)
    if (right>impactLocation-65){ //What is the 65 for?
      const dodgerTopEdge = positionToInteger(DODGER.style.top);
      const rockTopEdge = positionToInteger(rock.style.top);
      const dodgerBottomEdge = positionToInteger(DODGER.style.top) + 65;
      const rockBottomEdge = positionToInteger(rock.style.top) + 30;

      return (
        (rockTopEdge <= dodgerTopEdge && rockBottomEdge >= dodgerTopEdge) ||
        (rockTopEdge >= dodgerTopEdge && rockBottomEdge <= dodgerBottomEdge) ||
        (rockTopEdge <= dodgerBottomEdge && rockBottomEdge >= dodgerBottomEdge)
        )
      }
  }

  function createRock(x) {
    //x is the location of where the rock will appear on the right side
    const rock = document.createElement('div')
    rock.className = 'rock'
    rock.style.top = `${x}px`

    var right = 0
    rock.style.right = right
    GAME.appendChild(rock)

    function moveRock() {
      if (stopMotion === false){
        rock.style.right = `${right += GUY_SPEED}px`;

        let rockLocation = rock.style.right.replace(/[^0-9.]/g, "");
        if (checkCollision(rock)){
          return endGame()
        }
        if (rockLocation > GAME_WIDTH-5){
          rock.remove();
          score += 10
          updateScore();
          ROCKS.shift();
        }
        else if (impactLocation < GAME_WIDTH){
          window.requestAnimationFrame(moveRock)
        }
      }else{
        return // What are we returning?
      }
    }
    moveRock()
    ROCKS.push(rock)
    return rock
  }

//END of game movement


//BEGIN End Game functions
  function endGame() {
    stopMotion = true;
    console.log("inside end game");
    if (ROCK_SPEED !== null && additionalGuys !== null) {
      clearInterval(ROCK_SPEED);
      clearInterval(gameInterval);
      additionalGuys.forEach(guy => clearInterval(guy))
      ROCK_SPEED = null
      GUY_SPEED = null
      additionalGuys = null
      gameInterval = null
    }
    window.removeEventListener('keydown', moveDodger)
    for(let i = 0; i < ROCKS.length; i++){
      ROCKS[i].remove()
    }
    var modal = document.getElementById('myModal')
    var closeButton = document.getElementsByClassName("close")[0]
    modal.style.display = "block";
    closeButton.onclick = function() {
      modal.style.display = "none";
    }
    var scoreSubmit = document.getElementById('score-form')
    var submitText = document.getElementById('score-text')
    var modalContent = document.getElementById('modal-content')
    // console.log(modalContent)
    scoreSubmit.addEventListener("submit", (e) => {
      e.preventDefault()
      let name = document.getElementById('score-input')

      fetch(USERS_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(
        {name: `${name.value}`,
        score: score})
      }).then(response => response.json()).then(json => console.log(json))
      scoreSubmit.remove()
      submitText.remove()
      resetGameButton = document.createElement("button")
      resetGameButton.innerHTML = "Play Again?"
      modalContent.append(resetGameButton)

      resetGameButton.addEventListener("click", (r) => {
        r.preventDefault()
        debugger
      })
    })
  }
//END of game function

//Supporting functions

function deleteAllRocks(){
  for (const rock of ROCKS){
    rock.remove();
  }
}

PAUSE.addEventListener('click', pauseGame)
window.addEventListener('keydown', pauseGame);
function pauseGame(e){
  let action = e.target.dataset.pause
  if (action === "pauseGame"){
    alert("Game has been Paused \n Click okay to resume")
  };
  if (e.keyCode ===13){
    alert("Game has been Paused \n Click okay to resume")

  }
}
//End of support functions


//Dodger Movement functions

  function moveDodger(e) {
    let action = e.which
    if (action === UP_ARROW){
      moveDodgerUp()
      e.preventDefault()
      e.stopPropagation()
    }
    if (action === DOWN_ARROW){
      moveDodgerDown()
      e.preventDefault()
      e.stopPropagation()
    }
    if (action === RIGHT_ARROW){
      moveDodgerRight()
      e.preventDefault()
      e.stopPropagation()
    }
    if (action === LEFT_ARROW){
      moveDodgerLeft()
      e.preventDefault()
      e.stopPropagation()
    }
  }

  function moveDodgerUp() {
    window.requestAnimationFrame(function() {
      const top = positionToInteger(DODGER.style.top)
      if (top > 0){
        DODGER.style.top = `${top-15}px`;
      }
    })
  }

  function moveDodgerDown() {
    window.requestAnimationFrame(function(){
      const down = positionToInteger(DODGER.style.top)
      if (down < 496){
        DODGER.style.top = `${down + 15}px`
      }
    })
  }

  function moveDodgerRight() {
    window.requestAnimationFrame(function() {
      const left = positionToInteger(DODGER.style.left)
      if (left){
        if (left < GAME_WIDTH){
          DODGER.style.left = `${left+8}px`;
        }
      }else{
        DODGER.style.left = `${25+8}px`;
      }
    })
  }

  function moveDodgerLeft() {
    window.requestAnimationFrame(function() {
      const left = positionToInteger(DODGER.style.left)
      if (left){
        if (left > 25){
          DODGER.style.left = `${left-8}px`;
        }
      }else{
        DODGER.style.left = `${25}px`;
      }
      if (left > 25){
        DODGER.style.left = `${left-8}px`;
      }
    })
  }

//END Movement


  function updateScore(){
    let scoreNumber = document.getElementById("scorenumber");
    scoreNumber.innerText = score;
  }

  function positionToInteger(p) {
    return parseInt(p.split('px')[0]) || 0
  }




// BACKGROUND functions
function createBG(){
  let bg = document.createElement("div");
  bg.className = 'bg'
  bg.style.right = '-100px';
  GAME.appendChild(bg);
}
// ENDLESS BACKGROUND BEGIN

function bgLoop() {
  let bg = document.createElement('div');
  bg.className = 'bg';
  let img = document.createElement('img');
  GAME.appendChild(bg);
  GAME.appendChild(bg);
  bg.style.right = `-${4778 - window.innerWidth}px`;
  // bg.style.right = '-3184px';

  function movebg() {
    if (positionToInteger(bg.style.right) < 400){
      if (positionToInteger(bg.style.right) === 0) {
        let top = positionToInteger(bg.style.right) + 1
        bg.style.right = `${top}px`
        window.requestAnimationFrame(movebg);
        bgLoop();
      }else{
        let top = positionToInteger(bg.style.right) + 1;
        bg.style.right = `${top}px`;
        window.requestAnimationFrame(movebg);
      }
    }else{
      bg.remove()
    }
  }

  movebg()
  return bg

}
var scoreSubmit = document.getElementById('score-form')
scoreSubmit.addEventListener("submit", (e) => {
  e.preventDefault()
  let name = document.getElementById('score-input')
  name.value
  })

// ENDLESS BACKGROUND END


function toggleTopScores(){
  if (topScoreDisplay.style.visibility === "hidden"){
    topScoreDisplay.style.visibility = "visible";
  }else{
    topScoreDisplay.style.visibility = "hidden";
  }
}

function toggleInstructions(){
  if (instructionsDisplay.style.visibility === "hidden"){
    instructionsDisplay.style.visibility = "visible";
  }else{
    instructionsDisplay.style.visibility = "hidden";
  }
}

  // cLog("top dodger",dodgerTopEdge)
  // cLog("bottom dodger",dodgerBottomEdge)
  // cLog("rock top",rockTopEdge)
  // cLog("rock Bottom",rockBottomEdge)
  // cLog("first", (rockTopEdge <= dodgerTopEdge && rockBottomEdge >= dodgerTopEdge))
  // cLog("Second", (rockTopEdge >= dodgerTopEdge && rockBottomEdge <= dodgerBottomEdge))
  //     cLog("third",(rockTopEdge <= dodgerBottomEdge && rockBottomEdge >= dodgerBottomEdge))
// })
