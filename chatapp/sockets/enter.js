'use strict';

module.exports = function (socket) {
    // 入室メッセージをクライアントに送信する
    socket.on('entryMyselfEvent', function (data) {
        console.log('入室クライアントのユーザ名：' + data);

        // 他クライアントが受信する入室表示イベント（receiveEntryEvent）を送信する
        socket.broadcast.emit('receiveEntryEvent', data);
    });
};