// YOUR CODE HERE:
// http://parse.hrr.hackreactor.com/chatterbox/classes/messages

var app = {
  server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
  messages: [],
  friends: [],
  rooms: {},
  currentRoom: 'lobby',
  username: 'anonymous',

  init: function () {
    $('#chats').on('click', '.username', app.handleUsernameClick);
    app.fetch();
    setInterval(app.fetch, 1000);
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  renderMessage: function(message) {
    var username = message.username;
    var text = message.text;
    var createdAt = message.createdAt;
    var $messageContainer = $('<div class="messageContainer"></div>');
    var $username = $(`<p class="username">${username}</p>`);
    if (app.friends.indexOf($username.text()) !== -1) {
      $messageContainer.addClass('friend');
    }
    var $text = $(`<p>${text}</p>`);
    var $createdAt = $(`<p>${createdAt}</p>`);

    $('#chats').append($messageContainer);
    $messageContainer.append($username);
    $messageContainer.append($text);
    $messageContainer.append($createdAt);

  },

  renderRoom: function(room) {
    if (this.rooms[room]) {
      return;
    }
    var newRoom = $('<option value="' + room + '">' + room + '</option>');
    this.rooms[room] = true;
    $('#roomSelect').append(newRoom);
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {
        order: '-createdAt'
      },
      success: function (data) {
        console.log(data);

        var messages = data.results;
        messages.forEach(function (elem) {
          app.renderRoom(elem.roomname);
        });

        var filteredMessages = messages.filter(function(elem) {
          return elem.roomname === app.currentRoom;
        });

        app.clearMessages();

        filteredMessages.forEach(function(elem) {
          app.renderMessage(elem);
          app.messages.push(elem);
        });

        console.log('chatterbox: Message retrieved');
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message', data);
      }
    });
  },

  createMessage: function(text) {
    var message = {
      username: this.username,
      text: text,
      roomname: this.currentRoom
    };

    this.send(message);
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  handleUsernameClick: function (event) {
    event.preventDefault();
    var username = $(event.target).text();
    app.friends.push(username);
  },

  handleSubmit: function(text) {
    this.createMessage(text);
  }

};

$(document).ready(function() {
  app.init();

  $('#roomSelect').on('change', function(event) {
    var newCurrentRoom = $('#roomSelect option:selected').text();
    app.currentRoom = newCurrentRoom;
    app.clearMessages();
    app.fetch();
  });

  $('#send').on('submit', function(event) {
    event.preventDefault();
    var text = $('#message').val();
    app.handleSubmit(text);


  });
});
