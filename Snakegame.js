// Generate empty board
var board = [];
var xaxis = 5;
var yaxis = 5;
var wallthickness = 1;
for (i=0; i < xaxis+2*wallthickness; i+=1) {
  board[i] = [];
  for (j=0; j < yaxis+2*wallthickness; j+=1) {
    board[i][j] = 0;
  }
}
for (i=0; i < yaxis+2*wallthickness; i+=1) {
    for (j=0; j < wallthickness; j+=1) {
        board[i][j] = 8;
        board[i][yaxis+2*wallthickness-1-j] = 8;
    }
}
for (i=0; i < xaxis+2*wallthickness; i+=1) {
    for (j=0; j < wallthickness; j+=1) {
        board[j][i] = 8;
        board[xaxis+2*wallthickness-1-j][i] = 8;
    }
}

//Initial head
var head = [2,2];
board[head[0]][head[1]] = 5;

//Generate food
var foodvalue = 1;

var foodGen = function() {
  var i = Math.floor(Math.random() * xaxis) + wallthickness;
  var j = Math.floor(Math.random() * yaxis) + wallthickness;
  while (board[i][j] !== 0) {
    i = Math.floor(Math.random() * xaxis + wallthickness);
    j = Math.floor(Math.random() * yaxis + wallthickness);
  }
  board[i][j] = (-foodvalue);
};

//Input left
var goLeft = function() {
  board[head[0]][head[1]-1] = 1;
  head[1] -= 1;
};

//Input right
var goRight = function() {
  board[head[0]][head[1]+1] = 2;
  head[1]+=1;
};

//Input Up
var goUp = function() {
  board[head[0]-1][head[1]] = 3;
  head[0] -= 1;
};

//Input down
var goDown = function() {
  board[head[0]+1][head[1]] = 4;
  head[0]+=1;
};

//Chop tail
var chopTail = function() {
  for (i = 0; i < xaxis+2*wallthickness; i+=1) {
    for (j = 0; j < yaxis+2*wallthickness; j+=1) {
        if (board[i][j] === 5) {
            board[i][j] = 0;
            return;
        }else if (board[i][j] === 1 && board[i][j+1] === 0) {
            board[i][j] = 0;
            return;
        }else if (board[i][j] === 2 && board[i][j-1] === 0) {
            board[i][j] = 0;
            return;
        }else if (board[i][j] === 3 && board[i+1][j] === 0) {
            board[i][j] = 0;
            return;
        }else if (board[i][j] === 4 && board[i-1][j] === 0) {
            board[i][j] = 0;
            return;
        }
    }
  }
};

//Check if food is nearby [left,right,up,down]
var checkStuff = function() {
  var checkStuff = [0,0,0,0];
  if (board[head[0]][head[1]-1] < 0) {checkStuff[0] = board[head[0]][head[1]-1]}
  if (board[head[0]][head[1]+1] < 0) {checkStuff[1] = board[head[0]][head[1]+1]}
  if (board[head[0]-1][head[1]] < 0) {checkStuff[2] = board[head[0]-1][head[1]]}
  if (board[head[0]+1][head[1]] < 0) {checkStuff[3] = board[head[0]+1][head[1]]}
  if (board[head[0]][head[1]-1] > 0) {checkStuff[0] = 1}
  if (board[head[0]][head[1]+1] > 0) {checkStuff[1] = 1}
  if (board[head[0]-1][head[1]] > 0) {checkStuff[2] = 1}
  if (board[head[0]+1][head[1]] > 0) {checkStuff[3] = 1}
  return checkStuff
};

//Opposite disable plug-in
var oppositeCheck = function(x,y) {
  if (( x == 1 && y == 2 ) || ( x == 2 && y == 1) || ( x == 3 && y == 4 ) || ( x == 4 && y == 3)) {
    return true;
  }else {
    return false;
  }
}


//Running
var gameStatus = "inPlay";
var counter = 0;
var needGen = 1
while (gameStatus == "inPlay") {
  console.log(board);
  console.log("Please input your move");
  var input = prompt();
  var movement = [0,0,0,0]; //[left,right,up,down]
  if (input == "l") {movement[0] = 1;}
  if (input == "r") {movement[1] = 1;}
  if (input == "u") {movement[2] = 1;}
  if (input == "d") {movement[3] = 1;}

  if (oppositeCheck((movement.indexOf(1) + 1) , board[head[0]][head[1]]) === false) {

    for (i = 0; i < 4; i+=1) {
      if (movement[i] === 1 && checkStuff()[i] > 0) {
        gameStatus = "crashed";
        console.log("YOU LOSER!!!!");
      }else if (movement[i] === 1 && checkStuff()[i] < 0) {
        counter = counter - checkStuff()[i];
        needGen = 1
      }
    }

    if (gameStatus == "inPlay" ) {
      if (movement[0] == 1) {
        goLeft();
      }else if (movement[1] == 1) {
        goRight();
      }else if (movement[2] == 1) {
        goUp();
      }else if (movement[3] == 1) {
        goDown();
      }
      if (counter > 0) {
        counter = counter -1;
      }else if (counter === 0) {
        chopTail();
      }
      if (needGen === 1) {
          foodGen();
          needGen = 0;
      }
    }
  }
}

//write win
//try foodvalue
//opposite not valid
//input-->checkstuff-->move/eat-->choptail(only if counter > 0)-->foodgen only if you eaten-->board
