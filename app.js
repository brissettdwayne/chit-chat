var express = require('express');
var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('./public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

var port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log('listening on ' + port);
});

// Socket.io
var userCount = 0;
io.on('connection', function(socket) {
  // when a user connects
  ++userCount;
  io.sockets.emit('userCount', { userCount: userCount });
  // when a user disconnects
  socket.on('disconnect', function(){
    --userCount;
    io.sockets.emit('userCount', { userCount: userCount });
  });
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function(data) {
    // we tell the client to execute 'new message'
    io.sockets.emit('new message', data);
  });
  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function(data){
    socket.broadcast.emit('typing', data);
  });
});
