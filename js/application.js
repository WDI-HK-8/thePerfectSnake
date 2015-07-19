$(document).ready(function() {
  //Resize plug-in
  $(window).resize(function() { $('td').each(function(){$(this).css({"height":$(this).width()})});$('table').css({"margin": $('td').width()*(-1)}) })
  //Tooltips active
  $(function () {$('[data-toggle="tooltip"]').tooltip()})
  //Global variables
  var board = [];
  var xaxis = 4;
  var yaxis = 4;
  var wallthickness = 1;
  var foodvalue = 1;
  var gameStatus = "idle";
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
  var playerTimes = [0];
  var gameMode;
  var index = 0; //Use only in multiplayer mode (index of who is playing)
  var level = 1; //Use only in arcade mode
  var wallColor = 'transparent';
  var headColor = 'black';
  var snakeColor = 'brown';
  var backgroundColor = 'white';
  var foodColor = 'red';
  var reverse = false;

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
          if([37, 38, 39, 40].indexOf(e.keyCode) > -1 && recordingTime === false && gameStatus === 'inPlay') {
            var timer = setInterval(function(){
              time += 1;
                $('.stopWatch').text(time/100);
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
                if (gameMode === 'Multiplayer') {
                  multiplayerAddOns();
                }else if (gameMode === 'Arcade') {
                  arcadeAddOns();
                }
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
                if (gameMode === 'Multiplayer') {
                  multiplayerAddOns();
                }else if (gameMode === 'Arcade') {
                  arcadeAddOns();
                }

              }
              if (needGen === 1 && gameStatus == "inPlay" ) {
                  foodGen();
                  needGen = 0;
              }
            }
            colorTranslate();
            numberOfMoves++;
            $('.numberOfMoves').text(numberOfMoves);
        }

        //Translate into colors + Calculate grid covered
        var colorTranslate = function () {
          gridsCovered = 0;
          for (i=0; i < xaxis+2*wallthickness; i+=1) {
              for (j=0; j < yaxis+2*wallthickness; j+=1) {
                  if (board[j][i] === 8) {
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":'transparent'})
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"box-shadow":'none'})
                  }else if (board[j][i] > 0 ){
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":snakeColor}); gridsCovered++
                  }else if (board[j][i] < 0 ){
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":foodColor})
                  }else if (board[j][i] === 0 ){
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":backgroundColor})
                  }if (j === head[0] && i === head[1]) {
                    $('.table tbody tr:nth-child(' + (j+1) + ') td:nth-child(' + (i+1) + ')').css({"background-color":headColor});
                  }
              }
          }
          $('.gridsCovered').text(((gridsCovered*100)/(xaxis*yaxis)).toFixed(2) + "% (" + gridsCovered + " out of " + (xaxis*yaxis) + ")")
      }

      //Reset
      var reset = function () {
        board = [];
        xaxis = 4;
        yaxis = 4;
        wallthickness = 1;
        foodvalue = 1;
        gameStatus = "idle";
        counter = 0;
        needGen = 1;
        head = [2,2];
        tail = [null,null];
        movement = [0,0,0,0]; //[left,right,up,down]
        recordingTime = false;
        time = 0;
        interval = 0;
        $('#buttonGroupOriginal button').removeClass('active'); $('#normal').addClass('active');
        autoMoving = false;
        gridsCovered = 1;
        numberOfMoves = 0;
        $('.table tbody').empty();
        playerNames = [];
        playerTimes = [0];
        $('#timeRecords').empty();
        $('#playerNames').empty();
        $('#timeRecords').append('<li>Time</li>');
        $('#playerNames').append('<li>Player</li>');
        $('#levels').empty();
        $('#levelsTime').empty();
        $('#levels').append('<li>Levels</li>');
        $('#levelsTime').append('<li>Time</li>');
        $('#levelDisplay').text('Level 1');
        $('#gridSize').text('2 x 2 grid');
        index = 0;
        level = 1;
        wallColor = 'transparent';
        headColor = 'black';
        snakeColor = 'brown';
        backgroundColor = 'white';
        foodColor = 'red';
        reverse = false;
        $('#buttonGroupCustom button').removeClass('active'); $('#reverseFalse').addClass('active')
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
        $('td').each(function(){$(this).css({"height":$(this).width()})})
        $('table').css({"margin": $('td').width()*(-1)})
        $('td').css({"border-color":'transparent'})

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

      //Arcade add-ons
      var arcadeAddOns = function() {
        if (gameStatus === "crashed") {
          $('#levelsTime').append('<li>crashed</li>');
          $('#levels').append('<li>Level ' + level + '</li>');
        }else if (gameStatus === "Won") {
          $('#levelsTime').append('<li>' + (time/100) + '</li>');
          $('#levels').append('<li>Level ' + level + '</li>');
          $('#nextLevelArcade').show();
        }
      }


      //Multiplayer add-ons
      var multiplayerAddOns = function() {
        if (gameStatus === "crashed") {
          playerTimes[index] = 'Lost';
          $('#timeRecords li:nth-child(' + (index + 2) + ')').text('Lost')
        }else if (gameStatus === "Won") {
          playerTimes[index] = (time/100);
          $('#timeRecords li:nth-child(' + (index + 2) + ')').text(time/100)
        }
        if ((index + 1) < $('.playerList input').length) {
          $('#nextPlayerButton').show()
        }
      }
      //********** Original mode **********
      //Board Initialise
      $('#startButtonOriginal').click(function() {
        $('#startButtonOriginal').hide();
        $('#buttonGroupOriginal').hide();
        $('.intro').hide();
        $('#scoreBoardOriginal').show();
        gameMode = 'Original';
        gameStatus = "inPlay";
        if (interval === 0) {
          interval = 150;
        }
        xaxis = 20;
        yaxis = 15;
        generateBoard();
        $('.numberOfMoves').text(numberOfMoves);
        $('.stopWatch').text(time);
      })
      //Speed choosing && determining reverse or not
      $('#verySlow').click(function() { $('#buttonGroupOriginal button').removeClass('active'); $(this).addClass('active'); interval = 400})
      $('#slow').click(function() {     $('#buttonGroupOriginal button').removeClass('active'); $(this).addClass('active'); interval = 250})
      $('#normal').click(function() {   $('#buttonGroupOriginal button').removeClass('active'); $(this).addClass('active'); interval = 150})
      $('#fast').click(function() {     $('#buttonGroupOriginal button').removeClass('active'); $(this).addClass('active'); interval = 100})
      $('#veryFast').click(function() { $('#buttonGroupOriginal button').removeClass('active'); $(this).addClass('active'); interval = 50})
      $('#reverseTrue').click(function() { $('#buttonGroupCustom button').removeClass('active'); $(this).addClass('active'); reverse = true})
      $('#reverseFalse').click(function() {$('#buttonGroupCustom button').removeClass('active'); $(this).addClass('active'); reverse = false})
      //Reset button
      $('#resetButtonOriginal').click(function() {
        reset();
        $('#startButtonOriginal').show();
        $('#buttonGroupOriginal').show();
        $('.intro').show();
        $('#scoreBoardOriginal').hide();
      })

      //********** Arcade mode **********
        //Board Initialise
        $('#startButtonArcade').click(function() {
          $('#scoreBoardArcade').show();
          $('.intro').hide();
          gameMode = 'Arcade';
          gameStatus = "inPlay";
          xaxis = 1 + level;
          yaxis = 1 + level;
          interval = 0;
          generateBoard();
          $('.numberOfMoves').text(numberOfMoves);
          $('.stopWatch').text(time);
          $('#startButtonArcade').hide();
          $('#resetButtonArcade').show();
          $('#nextLevelArcade').hide();

        })
        //Next level button
        $('#nextLevelArcade').click(function() {
          gameStatus = 'inPlay';
          board = [];
          $('.table tbody').empty();
          counter = 0;
          needGen = 1;
          head = [2,2];
          tail = [null,null];
          movement = [0,0,0,0]; //[left,right,up,down]
          recordingTime = false;
          time = 0;
          gridsCovered = 1;
          numberOfMoves = 0;
          level++;
          xaxis = 1 + level;
          yaxis = 1 + level;
          generateBoard();
          $('#levelDisplay').text('Level ' + level);
          $('#gridSize').text(xaxis + ' x ' + yaxis + ' grid');
          $('.numberOfMoves').text(numberOfMoves);
          $('.stopWatch').text(time);
          $('#nextLevelArcade').hide();
        })
        //Reset button
        $('#resetButtonArcade').click(function() {
          reset();
          $('#startButtonArcade').show();
          $('#resetButtonArcade').hide();
          $('#scoreBoardArcade').hide();
          $('.intro').show();
        })

      //********** Multiplayer mode **********
        //Add new player
        $('#addNewPlayerButton').click(function() {
          $('.playerList').append('<input type="text" class="form-control" placeholder="Player ' + ($('.playerList input').length + 1) + '">')
        })

        //Preview board
        $('#xaxisInputMulti, #yaxisInputMulti').keyup(function() {
          reset();
          if (parseInt($('#xaxisInputMulti').val()) >= 2) { xaxis = parseInt($('#xaxisInputMulti').val())};
          if (parseInt($('#yaxisInputMulti').val()) >= 2) { yaxis = parseInt($('#yaxisInputMulti').val())};
          generateBoard();
        })

        //Board Initialise
        $('#startButtonMulti').click(function() {
          $('#scoreBoardMulti').show();
          $('#resetButtonMulti').show();
          $('#multiplayer form').hide();
          $('#addNewPlayerButton').hide();
          $('.intro').hide();
          interval = 0;
          gameStatus = "inPlay";
          gameMode = 'Multiplayer';
          for (i = 0; i < $('.playerList input').length; i++) {
            playerNames[i] = "Player " + (i+1);
            playerTimes[i] = 0;
            if ($('.playerList input:nth-child('+ (i+2) + ')').val() !== '') {
              playerNames[i] = $('.playerList input:nth-child('+ (i+2) + ')').val();
            }
            $('#playerNames').append('<li>' + playerNames[i] + '</li>');
            $('#timeRecords').append('<li>' + playerTimes[i] + '</li>')
          }

          $('#whosTurn').text(playerNames[0] + ' \'s turn')
        })

        //Next player button
        $('#nextPlayerButton').click(function() {
          index++;
          $('#whosTurn').text(playerNames[index] + ' \'s turn');
          gameStatus = 'inPlay';
          board = [];
          $('.table tbody').empty();
          counter = 0;
          needGen = 1;
          head = [2,2];
          tail = [null,null];
          movement = [0,0,0,0]; //[left,right,up,down]
          recordingTime = false;
          time = 0;
          gridsCovered = 1;
          numberOfMoves = 0;
          $('#nextPlayerButton').hide();
          generateBoard();
          $('.numberOfMoves').text(numberOfMoves);
          $('.stopWatch').text(time);
        })

        //Reset button
        $('#resetButtonMulti').click(function() {
          reset();
          generateBoard();
          $('#scoreBoardMulti').hide();
          $('#multiplayer form').show();
          $('#addNewPlayerButton').show();
          $('.intro').show();
          $('input').val('');
          $('.playerList').empty();
          $('.playerList').append('<label class="intro">Player names</label><input type="text" class="form-control" placeholder="Player 1"><input type="text" class="form-control" placeholder="Player 2">')
        })

        //********** Custom mode **********

        //Preview board
        $('#custom form').keyup(function() {
          reset();
          if (parseInt($('#xaxisInputCustom').val()) >= 2) {xaxis =   parseInt($('#xaxisInputCustom').val())};
          if (parseInt($('#yaxisInputCustom').val()) >= 2) {yaxis =   parseInt($('#yaxisInputCustom').val())};
          if (parseInt($('#wallThicknessInput').val()) >= 1) { wallthickness = parseInt($('#wallThicknessInput').val())};
          if ($('#wallColorInput').val() !== '') {wallColor =   $('#wallColorInput').val()};
          if ($('#headColorInput').val() !== '') {headColor =   $('#headColorInput').val()};
          if ($('#snakeColorInput').val() !== '') {snakeColor =   $('#snakeColorInput').val()};
          if ($('#backgroundColorInput').val() !== '') {backgroundColor =   $('#backgroundColorInput').val()};
          if ($('#foodColorInput').val() !== '') {foodColor =   $('#foodColorInput').val()};
          head[1] = 1 + wallthickness;
          head[0] = 1 + wallthickness;
          var headXaxis = parseInt($('#headXaxis').val());
          var headYaxis = parseInt($('#headYaxis').val());
          if (headXaxis >= 1 && headXaxis <= xaxis) {       head[1] = headXaxis - 1 + wallthickness};
          if (headYaxis >= 1 && headYaxis <= yaxis) {       head[0] = headYaxis - 1 + wallthickness};
          generateBoard();
        })

        //Board Initialise
        $('#startButtonCustom').click(function() {
          gameMode = 'Custom';
          gameStatus = "inPlay";
          if (parseInt($('#foodValueInput').val()) >=1) { foodvalue = parseInt($('#foodValueInput').val())};
          if (parseInt($('#initialC').val()) >= 1) {      counter = parseInt($('#initialC').val()) - 1};
          if ($('#moveInterval').val() > 0) {             interval = $('#moveInterval').val()*1000};
          $('.numberOfMoves').text(numberOfMoves);
          $('.stopWatch').text(time);
          $('#scoreBoardCustom').show();
          $('#custom form').hide();
          $('.intro').hide();
        })

      //Reset button
      $('#resetButtonCustom').click(function() {
        reset();
        generateBoard();
        $('#scoreBoardCustom').hide();
        $('#custom form').show();
        $('.intro').show();
        $('input').val('');
      })


        //********** Running / Key listening **********

        $(document).keydown(function (e) {
          if (reverse == false) {
            if (e.keyCode == 37 && gameStatus === "inPlay") {movement = [1,0,0,0]; speedControl()};
            if (e.keyCode == 39 && gameStatus === "inPlay") {movement = [0,1,0,0]; speedControl()};
            if (e.keyCode == 38 && gameStatus === "inPlay") {movement = [0,0,1,0]; speedControl()};
            if (e.keyCode == 40 && gameStatus === "inPlay") {movement = [0,0,0,1]; speedControl()};
          }else if (reverse == true) {
            if (e.keyCode == 37 && gameStatus === "inPlay") {movement = [0,1,0,0]; speedControl()};
            if (e.keyCode == 39 && gameStatus === "inPlay") {movement = [1,0,0,0]; speedControl()};
            if (e.keyCode == 38 && gameStatus === "inPlay") {movement = [0,0,0,1]; speedControl()};
            if (e.keyCode == 40 && gameStatus === "inPlay") {movement = [0,0,1,0]; speedControl()};
          }
        });

        //********** Reset when switch tabs **********
        $('.nav-tabs li:nth-child(1), .nav-tabs li:nth-child(2)').click(function() {reset()})
        //Multiplayer & custom default grid
        $('.nav-tabs li:nth-child(3), .nav-tabs li:nth-child(4)').click(function() {reset(); generateBoard();})

//********** No Scroll plug-in **********//
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

})
