'use strict';

module.exports = function (socket, xssFilters) {
    // 退室メッセージをクライアントに送信する
    socket.on('exitMyselfEvent', function (data) {
        data = xssFilters.inHTMLData(data);
        socket.broadcast.emit('exitOtherEvent', data);
    });
};