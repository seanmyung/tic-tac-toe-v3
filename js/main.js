//immediately invoked function
!function() {
//Screen option object for start screen and each win screen
  const screenOption = {
    startScreen: "<div class='screen screen-start' id='start'>" +
                 "<header><h1>Tic Tac Toe</h1>" +
                 "<a href='#' class='button'>Start game</a></header>" +
                 "</div>",
    win1Screen: "<div class='screen screen-win screen-win-one' id='finish'>" +
               "<header><h1>Tic Tac Toe</h1>" +
               "<p class='message'>Player 1 wins</p>" +
               "<a href=''#' class='button'>New game</a>" +
               "</header></div>",
    win2Screen: "<div class='screen screen-win screen-win-two' id='finish'>" +
                "<header><h1>Tic Tac Toe</h1>" +
                "<p class='message'>Player 2 wins</p>" +
                "<a href=''#' class='button'>New game</a>" +
                "</header></div>",
    tieScreen: "<div class='screen screen-win screen-win-tie' id='finish'>" +
               "<header><h1>Tic Tac Toe</h1>" +
               "<p class='message'>Game's tie!</p>" +
               "<a href=''#' class='button'>New game</a>" +
               "</header></div>"
  };

  //Appear the start screen
  $('body').append(screenOption.startScreen);

  const $start = $('#start');
  const $boardScreen = $('#board');
//Constructor function
  function Player(playerNo) {
    this.playerNo = playerNo;
  }
//Player enter method to ask player's name and to have a game with computer.
  Player.prototype.enter = function () {
    if(this.playerNo == 3) {
      var againstComputer = confirm('Do you want to have a game with Computer?');
      return againstComputer;
    } else {
      var playerName = prompt('Please enter your name for player' + this.playerNo);
      return playerName;
    }
  }

  var player1Name = new Player(1);  //Variable for player1
  var player2Name = new Player(2);  //Variable for player2
  var player3Name = new Player(3);  //Variable for Computer

  const $player1 = $('#player1');
  const $player2 = $('#player2');
//When click the start, ask players' name
  $('.button').click(function() {
      $start.hide();
      $boardScreen.show();
//If player enter null, input 'Player1' text or input the name a user entered
  var $player1Text =  $player1.text(player1Name.enter());
      if($player1Text.text() == '') {
        $player1.text('Player1');
      } else {
        $player1.text();
      }
//If player click 'ok', you will have a game with computer. Or have a game with other people.
      if (player3Name.enter()) {
        $player2.text('Computer');
      } else {
        var $player2Text =  $player2.text(player2Name.enter());
        if($player2Text.text() =='') {
          $player2.text('Player2');
        } else {
          $player2.text();
        }
      }
  });

//Highlight for the player1 on default
  $player1.addClass('active');
//backGroundImage function
  function backGroundImage(selector, option) {
    var backGround = 'background-image:' + option;
    selector.attr('style', backGround);
  }

  const $box = $('.box');
  const player1Url = "url('img/o.svg')";
  const player2Url = "url('img/x.svg')";

//When the players click on the empty square, display each player's symbol
  $box.each(function () {
    $(this).mouseover(function() {
      if($player1.hasClass('active')) {
        backGroundImage($(this), player1Url);
      } else {
        backGroundImage($(this), player2Url);
      }
    });
    $(this).mouseleave(function() {
      backGroundImage($(this), "none");
    });
  });

//Make an array to record player's input
  var winListArr = [];
    for(var i = 0; i < $box.length; i++) {
      winListArr[i] = 0;
    }
//When the players click on the square, add the proper image to the square marking
  $box.click(function(){
    if($player1.hasClass('active')) {
      $(this).addClass('box-filled-1');
      backGroundImage($(this), player1Url);
      $(this).unbind('mouseover mouseleave click');
    } else {
      $(this).addClass('box-filled-2');
      backGroundImage($(this), player2Url);
      $(this).unbind('mouseover mouseleave click');
    }

//Store values to '1, 2' depending on players' click
    $box.each(function () {
      if($(this).hasClass('box-filled-1')) {
        winListArr[$(this).index()] = 1;
      } else if($(this).hasClass('box-filled-2')) {
        winListArr[$(this).index()] = 2;
      }
    });

//If the player2 is not a computer, the player2 have to click the square to the next process
    if($player2.text() != "Computer") {
      if($player1.hasClass('active')) {
        $player1.removeClass('active');
        $player2.addClass('active');
      } else if($player2.hasClass('active')) {
        $player2.removeClass('active');
        $player1.addClass('active');
      }
//If the player2 is a computer, call the getRandomPlay to click the square automatically.
    } else {
      $player1.removeClass('active');
      $player2.addClass('active');
      getRandomPlay();
    }
//Call a checkWin function to detect winner
      checkWin();
  });

  function getRandomNumber() {
    return Math.floor(Math.random() * winListArr.length);
  }
//Get random number within the square box numbers, click  and display a proper image in the square
  function getRandomPlay() {
//No number repeat
    var randomNumber = getRandomNumber();
    console.log('initial random number: ' + randomNumber);
    var getNumber = true;
    while(getNumber) {
//extract random number withine winList array length without repeat number
      if(winListArr[randomNumber] > 0) {
        if(winListArr.every(x => x > 0)) {
          getNumber = false;
        } else {
        randomNumber = getRandomNumber();
        getNumber = true;
        }
      } else {
        getNumber = false;
      }
    }
//If the player2 is a computer, the player2 have to click the square to the next process
    if($player2.hasClass('active')) {
      $box.eq(randomNumber).addClass('box-filled-2');
      $box.eq(randomNumber).attr('style', "background-image: url('img/x.svg')");
      $box.unbind('mouseover mouseleave');
      $player2.removeClass('active');
      $player1.addClass('active');
    }
  }

//Check a winner
  var checkWin = function () {
//When the detectWin fuction returns 1, the player1 wins
      if(detectWin() == 1) {
        $('body').append(screenOption.win1Screen);
        if($player1.text().length > 0) {
          $('.message').text($player1.text() + ' wins!');
        } else {
            $('.message').text('Player1 wins!');
        }
//When the detectWin fuction returns 2, the player2 wins
      } else if (detectWin() == 2) {
        $('body').append(screenOption.win2Screen);
        if($player2.text().length > 0) {
          if($player2.text() == 'Computer') {
            $('.message').text('Computer wins!');
          }else {
            $('.message').text($player2.text() + ' wins!');
          }
        }
//When the detectWin fuction returns no '1,2' and the squares are full, the players tie
      } else if(winListArr.every(x => x > 0) && detectWin() != 1 && detectWin() != 2){
          $('body').append(screenOption.tieScreen);
      }
  };

//Detect a winner
  var detectWin = function () {
//Detect a winner on the row
    for(var i = 0; i < 7; i += 3) {
      if(winListArr[i] === 1 && winListArr[i+1] === 1 && winListArr[i+2] === 1) {
        return 1;
      } else if(winListArr[i] === 2 && winListArr[i+1] === 2 && winListArr[i+2] === 2) {
        return 2;
      }
    }
//Detect a winner on the column
    for(var i = 0; i < 3; i += 1) {
      if(winListArr[i] === 1 && winListArr[i+3] === 1 && winListArr[i+6] === 1) {
        return 1;
      } else if(winListArr[i] === 2 && winListArr[i+3] === 2 && winListArr[i+6] === 2) {
        return 2;
      }
    }
//Detect a winner diagonally
    if(winListArr[0] === 1 && winListArr[4] === 1 && winListArr[8] === 1) {
      return 1;
    } else if(winListArr[0] === 2 && winListArr[4] === 2 && winListArr[8] === 2) {
      return 2;
    }
    if(winListArr[2] === 1 && winListArr[4] === 1 && winListArr[6] === 1) {
      return 1;
    } else if(winListArr[2] === 2 && winListArr[4] === 2 && winListArr[6] === 2) {
      return 2;
    }
  };
}();
