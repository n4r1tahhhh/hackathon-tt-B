'use strict';

module.exports = function (socket) {
    // 入室メッセージをクライアントに送信する
    socket.on('enterMyselfEvent', function (data) {
        socket.broadcast.emit('enterOtherEvent', data);
        socket.emit('enterMyselfEvent', data);
    });
};