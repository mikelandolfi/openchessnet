'use strict';

var user; 
var password; 

function doLogin() { 
  user = $('#username').val(); 
  password = $('#password').val(); 
  if (password === '') { 
    // student view
    window.location = 'student.html'; 
  } else if (password != 'password') {
    alert('Password incorrect; try again if attempting to login as instructor.'); 
  } else { 
    // instructor view
    window.location = 'teacher.html'; 
  }
}
