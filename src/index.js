
const USERS_URL = 'http://localhost:3000/api/v1/users';
const DODGER = document.getElementById('dodger');
const GAME = document.getElementById('game');
const GAME_HEIGHT = 600;
const GAME_WIDTH = window.innerWidth;
const UP_ARROW = 38 ;// use e.which!
const DOWN_ARROW = 40; // use e.which!
const RIGHT_ARROW = 39;
const LEFT_ARROW = 37
const ROCKS = []
const START = document.getElementById('start')
const OVERLAY = document.getElementById("overlay")
const PAUSE = document.getElementById("pause")
const HIGH_SCORE = document.getElementById('high-scores')
let random = function (min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
let ROCK_SPEED = 4
let stopMotion = false;
let rockGenerateTime = 1100

ROCK_SPEED = setInterval(speedIncrease, 10000)

function speedIncrease() {
  if (ROCK_SPEED<14){
    ++ROCK_SPEED
  }
}

// function one(ROCK_SPEED) {
//    return ROCK_SPEED = ROCK_SPEED+1
// }
//
// let upByOne = setInterval(one(ROCK_SPEED), 4000)

  // 20px for rock size
  //40 for dodger size
  // 10 margin change
  const impactLocation = GAME_WIDTH-30-40
  var gameInterval = null;
  let score = 0;

  DODGER.addEventListener("click", function(e){
    debugger;
  })

  // GET request for high scores
  fetch(USERS_URL).then(response => response.json()).then(json=> highScore(json))

  function highScore (array) {
    let sortedHalfwayThere = array.sort(function (a,b) {
      return a.scores[0].score - b.scores[0].score
    })
    let sortedFinal = sortedHalfwayThere.reverse()
    // let i = 0
    // while (i < 2) {
    sortedFinal.forEach(obj => {

      tr = document.createElement('tr')
      tr.innerHTML = `<th>${obj.name}</th>
      <th>${obj.scores[0].score}</th>`
      HIGH_SCORE.append(tr)

    })
    // i++
  // }

  }


  function createBG(){
    let bg = document.createElement("div");
    bg.className = 'bg'
    bg.style.right = '-100px';
    GAME.appendChild(bg);
  }

  function checkCollision(rock) {
    const right = positionToInteger(rock.style.right)

    rock.style.right = right
    GAME.appendChild(rock)
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

    // if (ROCK_SPEED < 5){
    //   setInterval(function() {
    //     return ROCK_SPEED+1
    //   }, 4000)
    // }

    function moveRock() {
      if (stopMotion === false){
        rock.style.right = `${right += ROCK_SPEED}px`;
        // console.log("speed",ROCK_SPEED)

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
        return
      }
    }

    moveRock()
    ROCKS.push(rock)
    return rock

  }

  function deleteAllRocks(){
    for (const rock of ROCKS){
      rock.remove();
    }
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


  // END GAME

  function endGame() {
    stopMotion = true;
    clearInterval(gameInterval)
    ROCK_SPEED=0
    window.removeEventListener('keydown', moveDodger)
    for(let i = 0; i < ROCKS.length; i++){
      ROCKS[i].remove()
    }
    // alert("YOU LOSE")
    var modal = document.getElementById('myModal')
    var closeButton = document.getElementsByClassName("close")[0]
    modal.style.display = "block";
    closeButton.onclick = function() {
      modal.style.display = "none";
    }
    var scoreSubmit = document.getElementById('score-form')
    var submitText = document.getElementById('score-text')
    var modalContent = document.getElementById('modal-content')
    console.log(modalContent)
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
    // PAUSE.style.display = "block"
    // PAUSE.addEventListener('click',pauseHandler);


    // START.style.display = 'none';
    gameInterval = setInterval(function() {
      createRock(Math.floor(Math.random() *  (GAME_HEIGHT - 20)))
    }, rockGenerateTime)
    // rockSpeed = setInterval(function() {
    //   debugger;
    //   moveRock(speed)
    //
    // },5000)
  }

  function pauseHandler(e) {
    pauseGame(e)
  }

function pauseGame(e){
  let action = e.target.dataset.pause
  if (action === "pauseGame"){
    alert("Game has been Paused \n Click okay to resume")
    // action = "gamePaused"
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
