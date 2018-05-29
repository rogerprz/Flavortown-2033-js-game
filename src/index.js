let ground = document.getElementById("ground")

document.addEventListener('DOMContentLoaded', function(e) {
  startGame()
});


var myGamePiece;

function startGame() {
  myGamePiece = new component(80, 50, "red", 30, 220);
  gameArea.start();
}





var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth-100;
        this.canvas.height = window.innerHeight-100;
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
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function updateGameArea() {
    gameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
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
