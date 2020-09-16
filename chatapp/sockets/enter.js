'use strict';

module.exports = function (socket, xssFilters) {
    // 入室メッセージをクライアントに送信する
    socket.on('enterMyselfEvent', function (data) {
        data = xssFilters.inHTMLData(data);

        // 入室してきた人の名前とクライアントidを保存
        userList.push(
            {name: data, id: socket.id}
        );

        socket.broadcast.emit('enterOtherEvent', data);
        socket.emit('enterMyselfEvent', data);
    });
};


// socket.broadcast.to('id').emit('receiveMessageEvent', data)
