$(document).ready(function() {
  //Resize plug-in
  $(window).resize(function() { $('td').each(function(){$(this).css({"height":$(this).width()});}) })
  //Global variables
  var board = [];
  var xaxis = 4;
  var yaxis = 4;
  var wallthickness = 1;
  var foodvalue = 1;
  var gameStatus = "inPlay";
  var counter = 0;
  var needGen = 1;
  var head = [2,2];
  var movement = [0,0,0,0]; //[left,right,up,down]

  //********** Functions **********

        //Food generation
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
                }else if (board[i][j] === 1 && board[i][j+1] <= 0) {
                    board[i][j] = 0;
                    return;
                }else if (board[i][j] === 2 && board[i][j-1] <= 0) {
                    board[i][j] = 0;
                    return;
                }else if (board[i][j] === 3 && board[i+1][j] <= 0) {
                    board[i][j] = 0;
                    return;
                }else if (board[i][j] === 4 && board[i-1][j] <= 0) {
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

        //Check win
        var checkWin = function () {
          var win = true;
          for (i=0; i < xaxis+2*wallthickness; i+=1) {
            for (j=0; j < yaxis+2*wallthickness; j+=1) {
              if (board[j][i] <= 0) {
                win = false;
              }
            }
          }
          return win
        }



        //Running

        var running = function() {
          if (oppositeCheck((movement.indexOf(1) + 1) , board[head[0]][head[1]]) === false) {

            for (i = 0; i < 4; i+=1) {
              if (movement[i] === 1 && checkStuff()[i] > 0) {
                gameStatus = "crashed";
                alert("YOU LOSER!!!!");
              }else if (movement[i] === 1 && checkStuff()[i] < 0) {
                counter = counter - checkStuff()[i];
                needGen = 1
              }
            }

            if (counter > 0 && gameStatus == "inPlay" ) {
              counter = counter -1;
            }else if (counter === 0) {
              chopTail();
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
              if (checkWin() === true) {
                gameStatus = "Won";
                alert("YOU WON!!!!NEXT LEVEL!!!");
              }

              if (needGen === 1 && gameStatus == "inPlay" ) {
                  foodGen();
                  needGen = 0;
              }
            }

            //Translate colors
            for (i=0; i < xaxis+2*wallthickness; i+=1) {
                for (j=0; j < yaxis+2*wallthickness; j+=1) {
                    if (board[j][i] === 8) {
                      $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'black'})
                    }else if (board[j][i] > 0 ){
                      $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'blue'})
                    }else if (board[j][i] < 0 ){
                      $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'red'})
                    }else if (board[j][i] === 0 ){
                      $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'white'})
                    }if (j === head[0] && i === head[1]) {
                      $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'green'})
                    }
                }

            }
          }
          movement = [0,0,0,0];
          console.log('reset')
        }
















        //********** Board initialize **********

        $('.form-inline button').click(function() {
          if (parseInt($('#xaxisInput').val()) >= 2) { xaxis = parseInt($('#xaxisInput').val())};
          if (parseInt($('#yaxisInput').val()) >= 2) { yaxis = parseInt($('#yaxisInput').val())};
          if (parseInt($('#wallThicknessInput').val()) >= 1) { wallthickness = parseInt($('#wallThicknessInput').val())};
          if (parseInt($('#foodValueInput').val()) >=1) { foodvalue = parseInt($('#foodValueInput').val())};
          var x = xaxis + 2 * wallthickness;
          var y = yaxis + 2 * wallthickness;
          for (i = 1; i <= y; i +=1 ) {
            $('.table tbody').append('<tr></tr>');
            for (j = 1; j <= x; j += 1) {
              $('.table tbody tr:nth-child(' + i + ')').append('<td></td>')
            }
          }
          $('td').each(function(){$(this).css({"height":$(this).width()});})

          // Generate empty board
          for (i=0; i < yaxis+2*wallthickness; i+=1) {
            board[i] = [];
            for (j=0; j < xaxis+2*wallthickness; j+=1) {
              board[i][j] = 0;
            }
          }
          //ok
          for (i=0; i < yaxis+2*wallthickness; i+=1) {
              for (j=0; j < wallthickness; j+=1) {
                  board[i][j] = 8;
                  board[i][xaxis+2*wallthickness-1-j] = 8;
              }
          }
          for (i=0; i < xaxis+2*wallthickness; i+=1) {
              for (j=0; j < wallthickness; j+=1) {
                  board[j][i] = 8;
                  board[yaxis+2*wallthickness-1-j][i] = 8;
              }
          }

          //Initial head [x,y]
          board[head[0]][head[1]] = 5;

          //Translate numbers to colors
          for (i=0; i < xaxis+2*wallthickness; i+=1) {
              for (j=0; j < yaxis+2*wallthickness; j+=1) {
                  if (board[j][i] === 8) {
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'black'})
                  }else if (board[j][i] === 5){
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'green'})
                  }
              }
          }
        })




        //********** Running **********

        $(document).keydown(function (e) {
          if (e.keyCode == 37) {movement[0] = 1; running();};
          if (e.keyCode == 39) {movement[1] = 1; running()};
          if (e.keyCode == 38) {movement[2] = 1; running()};
          if (e.keyCode == 40) {movement[3] = 1; running()};
        });



})
