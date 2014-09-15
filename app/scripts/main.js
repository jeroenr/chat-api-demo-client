'use strict';
/* global JST */
/* global ChatSavvy */
$(function () {
    var FADE_TIME = 150; // ms

    var $usernameInput = $('.usernameInput');
    var $messageInput = $('.messageInput');

    var $loginPage = $('.login.page');
    var $chatPage = $('.chat.page');
    var $messages = $('.messages');

    var $window = $(window);

    var $currentInput = $usernameInput.focus();

    var username;
    var client;
    var currentRoom;

    function cleanInput(input) {
        return $('<div/>').text(input).text();
    }

    // Sets the client's username
    function setupPrimus(data) {
        var url = 'https://alpha.fromamsterdamwithlove.net?' + $.param(data);
        client = Primus.connect(url)

        client.on('open', function () {
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');
            $currentInput = $messageInput.focus();

            currentRoom = 'general';
            client.send('join', {room: currentRoom}, function (room) {
                console.log('Joined room: ' + room);
            });

            client.send('listrooms', {}, function(rooms) {
                console.log('rooms: '+ rooms);
            });
        });

        client.on('message', function (msg, callback) {
            addChatMessage(msg);
            console.log("Msg " + msg + " received");
            callback && callback(msg.id);
        });
    }

    function setUsername() {
        username = cleanInput($usernameInput.val().trim());

        // If the username is valid
        if (username) {
            $.ajax(
                'https://alpha.fromamsterdamwithlove.net/demo/' + username + '/token',
                {
                    success: function (data) {
                        setupPrimus(data);
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('pcampus:J6IpR|4q'));
                    }
                });
        }
    }

    function sendMessage() {
        var message = $messageInput.val();
        message = cleanInput(message);
        if (message) {
            client.send('msgtoroom', {message: message, room: currentRoom}, function(success) {
                console.log('send message ('+message+') successfull: '+success);
            });
            $messageInput.val('');
        }
    }

    function addChatMessage(data, options) {
        options = options || {};
        var li = JST['chat-message'](data, options);

        addMessageElement(li, options);
    }

    function addMessageElement(el, options) {
        var $el = $(el);

        var defaults = {fade: true, prepend: false};

        options = options || {};
        options = $.extend({}, defaults, options);

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    $window.keydown(function (event) {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if ($loginPage.is(':visible')) {
                console.log('logging in');
                setUsername();
            } else if ($chatPage.is(':visible')) {
                console.log('sending message');
                sendMessage();
            }
        }
    });
});
