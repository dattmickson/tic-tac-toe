var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 8080;
var users = [];

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function(socket) {
  console.log('new connection made');

  socket.on('get-users', function(){
  	socket.emit('all-users', users);
  });
  
  //when new sockets join
  socket.on('join', function(data){
  	console.log(data); //nickname
  	console.log(users);
  	socket.nickname = data.nickname;
  	users[socket.nickname] = socket;
  	var userObj = {
  		nickname: data.nickname,
  		socketid: socket.id
  	}
  	users.push(userObj);
  	io.emit('all-users', users)
  });
  // socket.on('joinGame', function(data){
  //   socket.player1 = data.player1;
  //   socket.player2 = data.player2;
  // });
  socket.on('send-message', function(data){
  	// socket.broadcast.emit('message-received', data);
  	io.emit('message-received', data)
  });
  socket.on('send-like', function(data){
  	console.log(data);
  	socket.broadcast.to(data.like).emit('user-liked', data);
  });
  socket.on('send-move', function(data){
    console.log(data);
    io.emit('move-received', data)
  });
  socket.on('disconnect', function(){
    users = users.filter(function(item){
      return item.nickname !== socket.nickname;
    });
    io.emit('all-users', users);
  });
});


server.listen(port, function() {
  console.log("Listening on port " + port);
});