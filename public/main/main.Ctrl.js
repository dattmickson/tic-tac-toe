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
  	var currentPlayer = 'X';
  	var emptyCell = '';
  	var players = 0;
  	$scope.player1 = '';
  	$scope.player2 = '';

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
      $scope.board = gameBoard;
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

	$scope.board = [
			//0,0                        0,1                   0,2
	[ { value: emptyCell, id:0 }, { value: emptyCell, id:1 }, { value: emptyCell, id:2 } ],
			//1,0                        1,1                   1,2
	[ { value: emptyCell, id:3 }, { value: emptyCell, id:4 }, { value: emptyCell, id:5 } ],
			//2,0                        2,1                   2,2
	[ { value: emptyCell, id:6 }, { value: emptyCell, id:7 }, { value: emptyCell, id:8 } ]
	];

	// $scope.currentPlayer = {};


    ///this needs updated!!!!!!!!
  	$scope.move = function(cell){
  		// angular.element(document.getElementById(table)).cell.value = currentPlayer;
      cell.value = currentPlayer;
      var gameBoard = $scope.board
      socket.emit('send-move', gameBoard)
  		switchTurn();
  	}

  	var switchTurn = function(){
  		if (currentPlayer === 'X'){
  			currentPlayer = 'O'
  		} else {
  			currentPlayer = 'X'
  		}
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