'use strict';

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        if (!data.message_data) {
            return
        }
        // 全クライアントが受信するメッセージ表示イベント（receiveMessageEvent）を送信する
        io.sockets.emit('recieveMessageEvent', data);
    });
};
