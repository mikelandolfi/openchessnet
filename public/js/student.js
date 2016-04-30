'use strict'; 

var isAnalyzing = false; 

var studentBoard = new Chess(); 
studentBoard = ChessBoard('smallboard', {draggable: true, dropOffBoard: 'trash', position: 'start', sparePieces: true})

// will main board update on instructor move without onChange? 
var onChange = function(oldPos, newPos) { }

// which of these options can be removed? 
var config = { draggable: false, position: 'start', onChange: onChange, 
               dropOffBoard: 'trash'};
var instructorBoard = new Chess(); 
instructorBoard = ChessBoard('board', config);

function disconnect() { 
  window.location = 'gateway.html';
}

//var socket = io.connect();
var socket = io(); 
$('form').submit(function() {
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg) {
  console.log('BANG!  text msg'); 
  $('#messages').append($('<li>').text(msg));
});
socket.on('newpos', function(fen) { 
  console.log('received new position data!');
  instructorBoard.position(fen); 
});

var stockfish = STOCKFISH(); 
stockfish.onmessage = function(event) { 
  var output = event.data ? event.data : event; 
  $('#engineoutput').append($('<li>').text(output)); 
}

function analyze() { 
  isAnalyzing = !isAnalyzing; 
  if (isAnalyzing) { // start the analysis 
    // alter button appearance during active analysis 
    $('#analyze').toggleClass('red'); 
    $('#engineoutput').empty(); // remove the old lines
    var posFEN = studentBoard.fen(); 
    if ($('#onmove').prop('checked')) { 
      posFEN += ' w'; 
    } else { posFEN += ' b'; }
    console.log('fen: '+posFEN); 
    stockfish.postMessage("position fen "+ posFEN); 
    // limit search depth in the name of preserving system resources
    stockfish.postMessage("go depth 15"); // grandmaster strength (2500+)
  } else { // shut off the engine 
    $('#analyze').toggleClass('red'); 
    stockfish.postMessage("stop"); 
    $('#engineoutput').append($('<li>').text("---engine stopped by user---")); 
  }
}

var flip = function() { 
  smallboard.orientation = !smallboard.orientation; 
  console.log('firing flip: orientation is '+smallboard.orientation)
}

$(document).ready(function() {  
  
  $('#startbtn').remove(); 
  $('#clearboard').remove(); 
  $('#flip').remove(); 
  
  $('#startbtnsmall').on('click', studentBoard.start);
  $('#clearboardsmall').on('click', studentBoard.clear);
  //$('#flipsmall').on('click', smallboard.orientation('flip'));
  $('#flipsmall').on('click', flip);
  $('#analyze').on('click', analyze);
  $(window).resize(function () { 
    studentBoard.resize; 
    board.resize; 
  });
});
