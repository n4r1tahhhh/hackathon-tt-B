'use strict';

global.userList = [];

module.exports = function (socket, xssFilters) {
    // 入室メッセージをクライアントに送信する
    socket.on('enterMyselfEvent', function (data) {
        data = xssFilters.inHTMLData(data);

        // 入室してきた人の名前とクライアントidを保存
        userList.push(
            {userName: data, socketId: socket.id}
        );

        var userNameList = [];
        for (let i = 0; i < userList.length; i++) {
            userNameList.push(userList[i]['userName']);
        }

        data = {
            userName: data,
            userNameList: userNameList
        }

        socket.broadcast.emit('enterOtherEvent', data);
        socket.emit('enterMyselfEvent', data);
    });
};


// socket.broadcast.to('id').emit('receiveMessageEvent', data)
