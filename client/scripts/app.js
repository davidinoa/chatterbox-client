// YOUR CODE HERE:
// http://parse.hrr.hackreactor.com/chatterbox/classes/messages

var app = {
  server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
  messages: [],
  init: function () {
    setInterval(this.fetch(), 1000);
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  renderMessage: function(message) {
    // var messages = this.messages;
    // for (var i = 0; i < messages.length; i++) {
    var username = message.username;
    var text = message.text;
    var createdAt = message.createdAt;
    var $messageContainer = $('<div></div>');
    var $username = $(`<p>${username}</p>`);
    var $text = $(`<p>${text}</p>`);
    var $createdAt = $(`<p>${createdAt}</p>`);

    $('#chats').append($messageContainer);
    $messageContainer.append($username);
    $messageContainer.append($text);
    $messageContainer.append($createdAt);
  },

  renderRoom: function(room) {
    var newRoom = $(`<option>${room}</option>`);
    // if ($('#roomSelect').children()_.contains(newRoom)) {
    //   return;
    // }
    $('#roomSelect').append(newRoom);
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      // data: 'where={"createdAt":{"$text":{"$search":{"$term":"2017-12"}}}}',
      data: {
        order: '-createdAt'
      },
      // contentType: 'application/json',
      success: function (data) {
        var messages = data.results;
        messages.forEach(function (elem) {
          app.messages.push(elem);
        });
        console.log('chatterbox: Message retrieved');
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message', data);
      }
    });
  },

  createMessage: function(username, text, roomname) {
    return message = {
      username: username,
      text: text,
      roomname: roomname
    };

  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      // contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },


};

// implement function to render messages
// jQuery script display messages in our HTML
// logic to update messages
