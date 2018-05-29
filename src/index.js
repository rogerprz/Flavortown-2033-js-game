let ground = document.getElementById("ground")

document.addEventListener('DOMContentLoaded', function(e) {
  startGame()
});


var myGamePiece;
var newObstacle;

function startGame() {
  myGamePiece = new component(80, 50, "blue", 30, 220);
  newObstacle = new component(50, 50, "green", 200,450)
  gameArea.start();
}


var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth-50;
        this.canvas.height = window.innerHeight-50;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = gameArea.context;
        // ctx.id = "box";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
      let yHeight = window.innerHeight-120
      if (this.x < 20){
        this.x = 20;
        this.speedX = 0;
      } else if (this.x > 400){
        this.x = 400;
        this.speedX = 0;
      }
       else {
        this.x += this.speedX;
      }
      if (this.y < 20){
        this.y = 20;
        this.speedY = 0;
      } else if (this.y > (window.innerHeight-160)) {
        this.y = (window.innerHeight-160);
        this.speedY = 0;
      } else {
        this.y += this.speedY;
      }
    }
}

function updateGameArea() {
    gameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
    newObstacle.update()
}


function moveShip() {
  if (event.keyCode === 38){
    // moves up
    myGamePiece.speedY -= 1;
  }
  else if  (event.keyCode === 40){
    // moves down
    myGamePiece.speedY += 1;
  }
  else if  (event.keyCode === 37){
    // moves left
    myGamePiece.speedX -= 1;
  }
  else if  (event.keyCode === 39){
    // moves right
    myGamePiece.speedX += 1;
  }
}

// function obstacle(width, height, color, x, y) {
//     this.width = width;
//     this.height = height;
//     this.x =x
//     this.y = y
//     this.update = function() {
//         ctx = gameArea.context;
//         // ctx.id = "box";
//         ctx.fillStyle = color;
//         ctx.fillRect(this.x, this.y, this.width, this.height);
//     }
//
// }
//
// function generateObstacle() {
//     h = (Math.random()) * 200
//     w = (Math.random()) * 200
//     myObstacle = new Obstacle(h, w)
//         ctx = gameArea.context;
//         ctx.fillStyle = "brown";
//         ctx.fillRect(myObstacle.x, myObstacle.y, myObstacle.width, myObstacle.height);
//
// }
