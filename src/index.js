
/**
 * Don't change these constants!
 */
 let cLog = console.log
const USERS_URL = 'http://localhost:3000/api/v1/users'
const DODGER = document.getElementById('dodger')
const GAME = document.getElementById('game')
const GAME_HEIGHT = 600
const GAME_WIDTH = window.innerWidth
const UP_ARROW = 38 // use e.which!
const DOWN_ARROW = 40 // use e.which!
const ROCKS = []
const START = document.getElementById('start')
const OVERLAY = document.getElementById("overlay")
const PAUSE = document.getElementById("pause")
const HIGH_SCORE = document.getElementById('high-scores')
// 20px for rock size
//40 for dodger size
// 10 margin change
const impactLocation = GAME_WIDTH-30-40
var gameInterval = null;
let score = 0;


fetch(USERS_URL).then(response => response.json()).then(json=> highScore(json))

function highScore (array) {
  let sortedHalfwayThere = array.sort(function (a,b) {
    return a.scores[0].score - b.scores[0].score
  })
  let sortedFinal = sortedHalfwayThere.reverse()

  sortedFinal.forEach(obj => {
    tr = document.createElement('tr')
    tr.innerHTML = `<th>${obj.name}</th>
    <th>${obj.scores[0].score}</th>`
    HIGH_SCORE.append(tr)
  })

}


function createBG(){
  let bg = document.createElement("div");
  bg.className = 'bg'
  bg.style.right = '-100px';
  GAME.appendChild(bg);
}

function checkCollision(rock) {
  const right = positionToInteger(rock.style.right)


  if (right>impactLocation-65){
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
  const rock = document.createElement('div')
  rock.className = 'rock'
  rock.style.top = `${x}px`

  var right = 0
  rock.style.right = right
  GAME.appendChild(rock)

  function moveRock() {
    rock.style.right = `${right += 2}px`;

    let rockLocation = rock.style.right.replace(/[^0-9.]/g, "");
     if (checkCollision(rock)){
       return endGame()
     }
     if (rockLocation > GAME_WIDTH-5){
       rock.remove();
       ++score
       updateScore();
     }
     else if (impactLocation < GAME_WIDTH){
       window.requestAnimationFrame(moveRock)
     }
  }

  moveRock()
  ROCKS.push(rock)
  return rock

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
}

function moveDodgerUp() {
  window.requestAnimationFrame(function() {
    const top = positionToInteger(DODGER.style.top)
    if (top > 0){
      DODGER.style.top = `${top-8}px`;
    }
  })
}


function moveDodgerDown() {
  window.requestAnimationFrame(function(){
    const down = positionToInteger(DODGER.style.top)
    if (down < GAME_HEIGHT){
      DODGER.style.top = `${down + 8}px`
    }
  })
}

function updateScore(){
  let scoreNumber = document.getElementById("scorenumber");
  scoreNumber.innerText = score;
}


function positionToInteger(p) {
  return parseInt(p.split('px')[0]) || 0
}

function start() {
  window.addEventListener('keydown', moveDodger);
  bgLoop();
  OVERLAY.style.display = "none";
  PAUSE.style.display = "block"
  PAUSE.addEventListener('click',pauseHandler);


  START.style.display = 'none';
  gameInterval = setInterval(function() {
    createRock(Math.floor(Math.random() *  (GAME_HEIGHT - 20)))
  }, 1000)
}

function pauseHandler(e) {
  pauseGame(e)

}

function pauseGame(e){
  let action = e.target.alt
  if (action === "pauseGame"){
    action = "gamePaused"
    ROCKS
    clearInterval(gameInterval)
  }
  else if (action === "gamePaused"){
    debugger;

  }
}


// cLog("top dodger",dodgerTopEdge)
// cLog("bottom dodger",dodgerBottomEdge)
// cLog("rock top",rockTopEdge)
// cLog("rock Bottom",rockBottomEdge)
// cLog("first", (rockTopEdge <= dodgerTopEdge && rockBottomEdge >= dodgerTopEdge))
// cLog("Second", (rockTopEdge >= dodgerTopEdge && rockBottomEdge <= dodgerBottomEdge))
//     cLog("third",(rockTopEdge <= dodgerBottomEdge && rockBottomEdge >= dodgerBottomEdge))
