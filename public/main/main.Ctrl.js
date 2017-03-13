(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash'];

  function MainCtrl($scope, $localStorage, socket, lodash) {
  	$scope.message = '';
  	$scope.messages = [];
  	$scope.users = [];
  	$scope.likes = [];
  	$scope.mynickname = $localStorage.nickname;
  	var nickname = $scope.mynickname;
  	
    var isCurrentPlayer = true;
  	var emptyCell = '';
  	var players = 0;
  	// $scope.player1 = '';
  	// $scope.player2 = '';
    $scope.winner = false;
    $scope.cat = false;
    $scope.gameWarning = '';

  	socket.emit('get-users');

  	socket.on('all-users', function(data){
  		console.log(data);
  		$scope.users = data.filter(function(item){
  			return item.nickname !== nickname;
  		});
  	});
  	socket.on('message-received', function(data){
  		$scope.messages.push(data);
     
  	});


    //this needs updated!!!!!!!!!!
    socket.on('move-received', function(data){
      $scope.boards[data.tableID].values = data.tttb;
      $scope.boards[data.tableID].switchTurn();
      //checkWin();
      //checkCat();
    });

  	socket.on('user-liked', function(data){
  		console.log(data);
  		$scope.likes.push(data.from);
  	});

    $scope.sendMessage = function(data){
      var newMessage = {
        message: $scope.message,
        from: $scope.mynickname
      }
      socket.emit('send-message', newMessage);
      $scope.message = '';
      //$scope.messages.push(newMessage);
    }
    $scope.sendLike = function(user){
      console.log(user);
      var id = lodash.get(user, 'socketid');
      var likeObj = {
        from: nickname,
        like: id
      }
      socket.emit('send-like', likeObj);
    }

	$scope.boards = [{
    index: 0,
    currentPlayer: 'X',
    values: [ 
    [ { value: emptyCell, id:0 }, { value: emptyCell, id:1 }, { value: emptyCell, id:2 } ],
    [ { value: emptyCell, id:3 }, { value: emptyCell, id:4 }, { value: emptyCell, id:5 } ],
    [ { value: emptyCell, id:6 }, { value: emptyCell, id:7 }, { value: emptyCell, id:8 } ] ],
    switchTurn: function(){
      if (this.currentPlayer === 'X'){
        this.currentPlayer = 'O';
      } else {
        this.currentPlayer = 'X';
      }
    }
  },
  {
    index: 1,
    currentPlayer: 'X',
    values:  [ 
    [ { value: emptyCell, id:0 }, { value: emptyCell, id:1 }, { value: emptyCell, id:2 } ],
    [ { value: emptyCell, id:3 }, { value: emptyCell, id:4 }, { value: emptyCell, id:5 } ],
    [ { value: emptyCell, id:6 }, { value: emptyCell, id:7 }, { value: emptyCell, id:8 } ] ],
    switchTurn: function(){
      if (this.currentPlayer === 'X'){
        this.currentPlayer = 'O';
      } else {
        this.currentPlayer = 'X';
      }
    }
  },
  {
    index: 2,
    currentPlayer: 'X',
    values: [ 
    [ { value: emptyCell, id:0 }, { value: emptyCell, id:1 }, { value: emptyCell, id:2 } ],
    [ { value: emptyCell, id:3 }, { value: emptyCell, id:4 }, { value: emptyCell, id:5 } ],
    [ { value: emptyCell, id:6 }, { value: emptyCell, id:7 }, { value: emptyCell, id:8 } ] ],
    switchTurn: function(){
      if (this.currentPlayer === 'X'){
        this.currentPlayer = 'O';
      } else {
        this.currentPlayer = 'X';
      }
    }
  },
  {
    index: 3,
    currentPlayer: 'X',
    values:  [ 
    [ { value: emptyCell, id:0 }, { value: emptyCell, id:1 }, { value: emptyCell, id:2 } ],
    [ { value: emptyCell, id:3 }, { value: emptyCell, id:4 }, { value: emptyCell, id:5 } ],
    [ { value: emptyCell, id:6 }, { value: emptyCell, id:7 }, { value: emptyCell, id:8 } ] ],
    switchTurn: function(){
      if (this.currentPlayer === 'X'){
        this.currentPlayer = 'O';
      } else {
        this.currentPlayer = 'X';
      }
    }
  }];

	// $scope.currentPlayer = {};


    var checkRow = function(){
     
      for (var i = 0; i<$scope.board[0].length; i++){
        if ($scope.board[i][0].value === $scope.board[i][1].value && $scope.board[i][1].value === $scope.board[i][2].value && $scope.board[i][0].value !== ''){
          return true;
        }
        if ($scope.board[0][i].value === $scope.board[1][i].value && $scope.board[1][i].value === $scope.board[2][i].value && $scope.board[0][i].value !== ''){
          return true;
        }
      }
    }

    var checkDiag = function(){
        if ($scope.board[0][0].value === $scope.board[1][1].value && $scope.board[1][1].value === $scope.board[2][2].value && $scope.board[0][0].value !== ''){
          return true;
        }
        if ($scope.board[0][2].value === $scope.board[1][1].value && $scope.board[1][1].value === $scope.board[2][0].value && $scope.board[0][2].value !== ''){
          return true;
        }
    }

    var checkWin = function(){
 
      if(checkRow() || checkDiag()){
        $scope.winner = true;
      }
      
    }

    
    var checkCat = function(){
      var x = 0;
      for (var i = 0; i<$scope.board[0].length; i++){
        for (var j = 0; j<$scope.board[0].length; j++){
          if ($scope.board[i][j].value !== ''){
            x ++;
          }
        }
      }
      if (x === 9){
        $scope.cat = true;
      }
    }

    var setMessage = function(msg) {
      document.getElementById('message').innerText = msg;
    }
    ///this needs updated!!!!!!!!
  	$scope.move = function(cell, table){
  		// angular.element(document.getElementById(table)).cell.value = currentPlayer;
      if(!isCurrentPlayer){
        setMessage('You are not apart of this game'); 
      } else if($scope.winner){
        setMessage('GameOver')
      }else if(cell.value === ''){
        setMessage('')
        cell.value = $scope.boards[table].currentPlayer;
        //var tableID = table;
        var gameBoard = {
          tttb: $scope.boards[table].values,
          tableID: table
        }
        socket.emit('send-move', gameBoard);
        //checkWin();
        //checkCat();
      } else {
        setMessage('That square is already used');
      }
  		// switchTurn();
  	}

    $scope.joinGame = function(){
      isCurrentPlayer = true
    }

  	
    
    $scope.isTaken = function(cell){
      return cell.value !== emptyCell
    }

    

        // $scope.JoinIt = function(){
    //  socket.emit('getPlayers');
    //  if(players === 0){
    //    $scope.player1 = $localStorage.nickname;
    //    players += 1;
    //    console.log($scope.player1);
    //    socket.emit('JoinIt',{
    //      player1: $scope.player1
    //    })
    //  } else if (players === 1){
    //    $scope.player2 = $localStorage.nickname;
    //    players += 1;
    //    console.log($scope.player2);
    //    socket.emit('JoinIt',{
    //      player2: $scope.player2
    //    })
    //  }
    //  else {
    //    console.log("cannot join");
    //  }
    // }
  	
  };
})();