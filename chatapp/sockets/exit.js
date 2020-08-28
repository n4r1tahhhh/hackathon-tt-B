'use strict';

module.exports = function (socket) {
    // 退室メッセージをクライアントに送信する
    socket.on('exitMyselfEvent', function (data) {
        console.log('退室クライアントのユーザ名：' + data);

        // 他クライアントが受信する退室表示イベント（receiveExitEvent）を送信する
        socket.broadcast.emit('receiveExitEvent', data);
    });
};