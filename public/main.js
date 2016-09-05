$(function() {
  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('#messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  var count = 0;
  var msg = new Object();

  // Prompt for setting a username
  var username;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      console.log(username);
    }
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13 && !username) {
        setUsername();
    }
  });

  $('form').submit(function(){
    if (count != 0) {
      msg.text = $inputMessage.val();
      msg.date = new Date().Format("yyyy-MM-dd hh:mm:ss");
      msg.username = username;
      displayMessage(msg);
      socket.emit('chat message', msg);
      $inputMessage.val('');
      console.log(username);
    }
    else {
      count++;
    }
    return false;
  });

  // Socket events
  socket.on('chat message', function(msg){
    displayMessage(msg);
  });

  function displayMessage(msg) {
    var txt1 = "<div style='font-size: 150%;  float: left; width: 50%; margin-left: 3px'>" + msg.username + "</div>";
    var txt2 = "<div style='margin-right: 5px; float: right; width: 40%; text-align: right'>" + msg.date + "</div>";
    var txt3 = $("<li>").text(msg.text);
    $messages.append(txt1, txt2, txt3);
  }

  Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
});