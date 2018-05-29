
/**
 * Don't change these constants!
 */
const DODGER = document.getElementById('dodger')
const GAME = document.getElementById('game')
const GAME_HEIGHT = 400
const GAME_WIDTH = 400
const LEFT_ARROW = 37 // use e.which!
const RIGHT_ARROW = 39 // use e.which!
const ROCKS = []
const START = document.getElementById('start')


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
  rock.style.top = `${x}px`

  var right = 0
  rock.style.right = right
  GAME.appendChild(rock)

  function moveRock() {
     if (checkCollision(rock)){
       endGame();
     }else if (positionToInteger(rock.style.right) < 380){
      right = right + Math.floor(Math.random() * 20)
      rock.style.right = `${right}px`
      window.requestAnimationFrame(moveRock)
    }else{
      rock.remove()
    }
  }

  moveRock()
  ROCKS.push(rock)
  return rock

}

// ENDLESS BACKGROUND BEGIN

function bgLoop() {
  let bg = document.createElement('div')
  bg.className = 'bg'
  GAME.appendChild(bg);
  bg.style.right = '-3184px';

  GAME.appendChild(bg)

  function movebg() {
     if (positionToInteger(bg.style.right) < 400){
      if (positionToInteger(bg.style.right) === 0) {
        let top = positionToInteger(bg.style.right) + 2
        bg.style.right = `${top}px`
        window.requestAnimationFrame(movebg);
        bgLoop();
      }else{
        let top = positionToInteger(bg.style.right) + 2
        bg.style.right = `${top}px`
        window.requestAnimationFrame(movebg);
      }
    }else{
      bg.remove()
    }
  }

  movebg()
  return bg

}

// ENDLESS BACKGROUND END


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
   if (e.which === LEFT_ARROW){
     moveDodgerLeft()
     e.preventDefault()
     e.stopPropagation()
   }
   if (e.which === RIGHT_ARROW){
     moveDodgerRight()
     e.preventDefault()
     e.stopPropagation()
   }
}

function moveDodgerLeft() {
  function moveL(){
    if(positionToInteger(DODGER.style.left)-4 >= 0){
      DODGER.style.left = `${positionToInteger(DODGER.style.left)-4}px`
    }
  }
  window.requestAnimationFrame(moveL)
}


function moveDodgerRight() {
  function moveR(){
    if(positionToInteger(DODGER.style.left)+40+4 <= GAME_WIDTH){
      DODGER.style.left = `${positionToInteger(DODGER.style.left)+4}px`
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

  bgLoop();
  
}
