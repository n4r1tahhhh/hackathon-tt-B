'use strict';

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        if (!data) {
            return
        }
        // 全クライアントが受信するメッセージ表示イベント（receiveMessageEvent）を送信する
        socket.broadcast.emit('recieveMessageEvent', data);
        socket.emit('recieveMyMessageEvent', data);
    });
};
