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
  var tail = [null,null];
  var movement = [0,0,0,0]; //[left,right,up,down]
  var recordingTime = false;
  var time = 0;
  var interval = 0;
  var autoMoving = false;
  var gridsCovered = 1;
  var numberOfMoves = 0;
  var playerNames = [];

  //********** Functions **********

        //Food generation
        var foodGen = function() {
          var i = Math.floor(Math.random() * xaxis) + wallthickness;
          var j = Math.floor(Math.random() * yaxis) + wallthickness;
          while (board[j][i] !== 0) {
            i = Math.floor(Math.random() * xaxis + wallthickness);
            j = Math.floor(Math.random() * yaxis + wallthickness);
          }
          board[j][i] = (-foodvalue);
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
                if (board[j][i] === 5) {
                    tail = [j,i];
                    console.log(tail)
                }else if (board[j][i] === 1 && board[j][i+1] <= 0) {
                    tail = [j,i];
                }else if (board[j][i] === 2 && board[j][i-1] <= 0) {
                    tail = [j,i];
                }else if (board[j][i] === 3 && board[j+1][i] <= 0) {
                    tail = [j,i];
                }else if (board[j][i] === 4 && board[j-1][i] <= 0) {
                    tail = [j,i];
                }
            }
          }
          if (counter > 0 && gameStatus == "inPlay" ) {
            counter = counter - 1;
          }else if (counter === 0) {
            board[tail[0]][tail[1]] = 0;
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

        //Timer
        $(document).keydown(function (e) {
          if([37, 38, 39, 40].indexOf(e.keyCode) > -1 && recordingTime === false) {
            var timer = setInterval(function(){
              time += 1;
              $('#stopWatchCustom').text(time/100);
              recordingTime = true;
               if(gameStatus !== "inPlay") {
                 clearInterval(timer);
               };
            }, 10);
          }
        })

        //Speed control system

        var speedControl = function() {
            if (interval === 0 && oppositeCheck((movement.indexOf(1) + 1) , board[head[0]][head[1]]) === false) {
                running();
                movement = [0,0,0,0];
            }
            else if (interval !== 0 && autoMoving === false) {
                autoMoving = true;
                var autoMove = setInterval(function(){
                    running();
                    if(gameStatus !== "inPlay") {
                      clearInterval(autoMove);
                    };
                }, interval);
            }
            if (oppositeCheck((movement.indexOf(1) + 1) , board[head[0]][head[1]]) === true) {
              movement = [0,0,0,0];
              movement[board[head[0]][head[1]]-1] = 1;
            }
        }

        //Running

        var running = function() {
            for (i = 0; i < 4; i+=1) {
              if (movement[i] === 1 && checkStuff()[i] > 0) {
                gameStatus = "crashed";
                alert("You Lost :((( Time taken: " + (time/100) + "s");
              }else if (movement[i] === 1 && checkStuff()[i] < 0) {
                counter = counter - checkStuff()[i];
                needGen = 1;
              }
            }
            if (gameStatus == "inPlay" ) {
              chopTail();
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
                alert("Perfect Snake! Well done!! Time taken: " + (time/100) + "s");
              }
              if (needGen === 1 && gameStatus == "inPlay" ) {
                  foodGen();
                  needGen = 0;
              }
            }
            colorTranslate();
            numberOfMoves++;
            $('#numberOfMoves').text(numberOfMoves);
        }

        //Translate into colors + Calculate grid covered

        var colorTranslate = function () {
          gridsCovered = 0;
          for (i=0; i < xaxis+2*wallthickness; i+=1) {
              for (j=0; j < yaxis+2*wallthickness; j+=1) {
                  if (board[j][i] === 8) {
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'black'})
                  }else if (board[j][i] > 0 ){
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'blue'}); gridsCovered++
                  }else if (board[j][i] < 0 ){
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'red'})
                  }else if (board[j][i] === 0 ){
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'white'})
                  }if (j === head[0] && i === head[1]) {
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'green'});
                  }
              }
          }
          $('#gridsCoveredCustom').text((gridsCovered*100)/(xaxis*yaxis) + "% (" + gridsCovered + " out of " + (xaxis*yaxis) + ")")
      }

      //Reset

      var reset = function () {
        board = [];
        xaxis = 4;
        yaxis = 4;
        wallthickness = 1;
        foodvalue = 1;
        gameStatus = "inPlay";
        counter = 0;
        needGen = 1;
        head = [2,2];
        tail = [null,null];
        movement = [0,0,0,0]; //[left,right,up,down]
        recordingTime = false;
        time = 0;
        interval = 0;
        autoMoving = false;
        gridsCovered = 1;
        numberOfMoves = 0;
        $('.table tbody').empty()
      }


      //Creating main board

      var generateBoard = function () {
        var x = xaxis + 2 * wallthickness;
        var y = yaxis + 2 * wallthickness;
        for (i = 1; i <= y; i +=1 ) {
          $('.table tbody').append('<tr></tr>');
          for (j = 1; j <= x; j += 1) {
            $('.table tbody tr:nth-child(' + i + ')').append('<td></td>')
          }
        }
        $('td').each(function(){$(this).css({"height":$(this).width()});})
        //Engine setup
        for (i=0; i < yaxis+2*wallthickness; i+=1) {
          board[i] = [];
          for (j=0; j < xaxis+2*wallthickness; j+=1) {
            board[i][j] = 0;
          }
        }
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
        board[head[0]][head[1]] = 5;
        colorTranslate();
      }




      //********** Multiplayer mode **********

        //Add new player
        $('#addNewPlayerButton').click(function() {
          $('.playerList').append('<input type="text" class="form-control" placeholder="Player ' + ($('.playerList input').length + 1) + '">')
        })

        //Board Initialise
        $('#startButtonMulti').click(function() {
          for (i = 0; i < $('.playerList input').length; i++) {
            playerNames[i] = "Player" + (i+1);
            if ($('.playerList input:nth-child('+ (i+2) + ')').val() !== '') {
              playerNames[i] = $('.playerList input:nth-child('+ (i+2) + ')').val();
            }
          }
          if (parseInt($('#xaxisInputMulti').val()) >= 2) { xaxis = parseInt($('#xaxisInputMulti').val())};
          if (parseInt($('#yaxisInputMulti').val()) >= 2) { yaxis = parseInt($('#yaxisInputMulti').val())};
          generateBoard();



        })




        //********** Custom mode **********

        //Board Initialise
        $('#startButtonCustom').click(function() {
          if (parseInt($('#xaxisInputCustom').val()) >= 2) { xaxis = parseInt($('#xaxisInputCustom').val())};
          if (parseInt($('#yaxisInputCustom').val()) >= 2) { yaxis = parseInt($('#yaxisInputCustom').val())};
          if (parseInt($('#wallThicknessInput').val()) >= 1) { wallthickness = parseInt($('#wallThicknessInput').val())};
          if (parseInt($('#foodValueInput').val()) >=1) { foodvalue = parseInt($('#foodValueInput').val())};
          if (parseInt($('#initialC').val()) >= 1) { counter = parseInt($('#initialC').val()) - 1};
          if ($('#moveInterval').val() > 0) { interval = $('#moveInterval').val()*1000};
          generateBoard();
          $('#numberOfMoves').text(numberOfMoves);
          $('#stopWatchCustom').text(time);
          $('#scoreBoardCustom').show();
          $('#custom form').hide();
        })

      //Reset button
      $('#resetButton').click(function() {
        reset();
        $('#scoreBoardCustom').hide();
        $('#custom form').show();
      })




        //********** Running / Key listening **********


        $(document).keydown(function (e) {
          //key register
          if (e.keyCode == 37) {movement = [1,0,0,0]; speedControl()};
          if (e.keyCode == 39) {movement = [0,1,0,0]; speedControl()};
          if (e.keyCode == 38) {movement = [0,0,1,0]; speedControl()};
          if (e.keyCode == 40) {movement = [0,0,0,1]; speedControl()};
        });







//********** No Scroll plug-in **********//
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

})
