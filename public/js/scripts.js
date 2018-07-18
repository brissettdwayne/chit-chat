console.log('Loaded');
var socket = io();

$(function (){
  chat();
  emitEvents();
  isTyping();
});

function chat() {
  $('form').submit(function(e){
    var message = {
      username: $('#username').val(),
      message: $('#message-box').val()
    }
    if ($('#username').val() == 0 || $('#message-box').val() == 0) {
      $('#error').text('Fill out both boxes').addClass('alert alert-danger');
      return false;
    }
    e.preventDefault();
    socket.emit('new message', message);
    $('#message-box').val('');
    $('#error').text('').removeClass('alert alert-danger');
  });
}

function isTyping() {
  $('#message-box').keypress(function() {
    socket.emit('typing', $('#username').val());
  });
}

function emitEvents() {
  socket.on('userCount', function (data) {
    $('#user-count').text(data.userCount + ' Users Online');
  });
  socket.on('typing', function(data){
    $('#typing').html($('<p>').text(data + ' is typing').addClass('form-text text-muted font-italic'));
  });
  socket.on('new message', function(data){
    $('#typing').html($('<p>').text(''));
    $('#messages').append($('<li>').text(data.username + ': ' + data.message));
  });
}
