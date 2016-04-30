'use strict'; 

//var socket = io.connect();
var socket = io(); 
var onChange = function(oldPos, newPos) { 
  var FEN = ChessBoard.objToFen(newPos);
  socket.emit('newpos', FEN); 
  //console.log('emitting new FEN'); 
}

var onDblclick = function() { 
  var square = onMouseoverSquare(s, p); 
  console.log('double clicked on square '+square); // TEST
  // TODO: add color highlights based on key depress (check for depress)
}
var onMouseoverSquare = function(square, piece) { 
  return square; 
}


var config = { draggable: true, position: 'start', onChange: onChange, 
               onMouseoverSquare: onMouseoverSquare,
               sparePieces: true, dropOffBoard: 'trash'};
//var board = ChessBoard('board', config);
var board = new Chess(); // does this help create an editing checkbox? 
board = ChessBoard('board', config); 

function disconnect() { 
  window.location = 'gateway.html';
}

var name = "INSTRUCTOR: "; 
$('form').submit(function() {
  socket.emit('chat message', name.concat($('#m').val()));
  //socket.broadcast.emit('chat message', name.concat($('#m').val()));
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg) {
  console.log('teacher.js: socket.on chat message...');
  $('#messages').append($('<li>').text(msg));
});


$('#board').on('onChange', function() { 
  socket.emit('newpos', $('#board').fen()); 
  console.log('emitting new FEN'); 
});



$(document).ready(function() {  
  $('#startbtn').on('click', board.start);
  $('#clearboard').on('click', board.clear);
  //$('#flip').on('click', board.orientation('flip'));
  //$('#board').dblclick(onDblclick); 
  //$(window).resize(board.resize);
});
