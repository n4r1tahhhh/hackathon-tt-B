'use strict';

module.exports = function (socket, xssFilters) {
    // 入室メッセージをクライアントに送信する
    socket.on('enterMyselfEvent', function (data) {
        data = xssFilters.inHTMLData(data);
        socket.broadcast.emit('enterOtherEvent', data);
        socket.emit('enterMyselfEvent', data);
    });
};