
/**
 * Don't change these constants!
 */
const DODGER = document.getElementById('dodger')
const GAME = document.getElementById('game')
const GAME_HEIGHT = window.innerWidth-50
const GAME_WIDTH = 400
const UP_ARROW = 38 // use e.which!
const DOWN_ARROW = 40 // use e.which!
const ROCKS = []
const START = document.getElementById('start')


let bg = document.createElement("div");
bg.className = 'bg'
GAME.appendChild(bg);
bg.style.right = '-100px';

function moveBG(object) {
   if (positionToInteger(object.style.right) < 400){
    let top = positionToInteger(object.style.right) + 4;
    object.style.right = `${top}px`;
    // window.requestAnimationFrame(moveBG)
  }
}

setInterval(moveBG(bg), 10);

DODGER.addEventListener("click", function(e){
  // window.setInterval(moveBG(bg), 0);
  // moveBG(bg);
  window.requestAnimationFrame(moveBG)


})

function createBG(){
  let bg = document.createElement("div");
  bg.className = 'bg'
  bg.style.right = '-100px';
  GAME.appendChild(bg);
}


var gameInterval = null


function checkCollision(rock) {
  const top = positionToInteger(rock.style.top)
  // rocks are 20px high
  // DODGER is 20px high
  // GAME_HEIGHT - 20 - 20 = 360px;
  if (top > 360) {
    const dodgerLeftEdge = positionToInteger(DODGER.style.left)
    // FIXME: The DODGER is 40 pixels wide -- how do we get the right edge?
    const dodgerRightEdge = positionToInteger(DODGER.style.left) + 40

    const rockLeftEdge = positionToInteger(rock.style.left)
    // FIXME: The rock is 20 pixel's wide -- how do we get the right edge?
    const rockRightEdge = positionToInteger(rock.style.left) + 20
    if (rockLeftEdge <= dodgerLeftEdge && rockRightEdge >= dodgerLeftEdge || rockLeftEdge >= dodgerLeftEdge && rockRightEdge <= dodgerRightEdge || rockLeftEdge <= dodgerRightEdge && rockRightEdge >= dodgerRightEdge
    ) {
      return true

    }
  }
}


function createRock(x) {
  const rock = document.createElement('div')
  rock.className = 'rock'
  rock.style.left = `${x}px`

  var top = 0
  rock.style.top = top
  GAME.appendChild(rock)

  function moveRock() {
     if (checkCollision(rock)){
       endGame()
     }else if (positionToInteger(rock.style.top) < 380){
      top = top + 2
      rock.style.top = `${top}px`
      window.requestAnimationFrame(moveRock)
    }else{
      rock.remove()
    }
  }

  moveRock()
  ROCKS.push(rock)
  return rock

}


// END GAME

function endGame() {
  clearInterval(gameInterval)
  window.removeEventListener('keydown', moveDodger)
  for(let i = 0; i < ROCKS.length; i++){
    ROCKS[i].remove()
  }
  alert("YOU LOSE!")
}

function moveDodger(e) {
   if (e.which === UP_ARROW){
     moveDodgerUp()
     e.preventDefault()
     e.stopPropagation()
   }
   if (e.which === DOWN_ARROW){
     moveDodgerRight()
     e.preventDefault()
     e.stopPropagation()
   }
}

function moveDodgerUp() {
  function moveL(){
    if(positionToInteger(DODGER.style.top)-4 >= 0){
      DODGER.style.top = `${positionToInteger(DODGER.style.top)-4}px`
    }
  }
  window.requestAnimationFrame(moveL)
}


function moveDodgerRight() {
  function moveR(){
    if(positionToInteger(DODGER.style.top)+40+4 <= GAME_WIDTH){
      DODGER.style.top = `${positionToInteger(DODGER.style.top)+4}px`
    }
  }
  window.requestAnimationFrame(moveR)
}

/**
 * @param {string} p The position property
 * @returns {number} The position as an integer (without 'px')
 */
function positionToInteger(p) {
  return parseInt(p.split('px')[0]) || 0
}

function start() {
  window.addEventListener('keydown', moveDodger)

  START.style.display = 'none'

  gameInterval = setInterval(function() {
    createRock(Math.floor(Math.random() *  (GAME_WIDTH - 20)))
  }, 1000)
}
