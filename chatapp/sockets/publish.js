'use strict';

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        if (!data) {
            return
        }

        // 投稿に一意のidを付与する
        data["id"] = getUniqueStr();

        socket.broadcast.emit('recieveMessageEvent', data);
        socket.emit('recieveMyMessageEvent', data);
    });
    // 投稿メッセージを取り消す
    socket.on('removeMessageEvent', function (messageId) {
        if (!messageId) {
            return
        }
        socket.broadcast.emit('removeMessageEvent', messageId);
        socket.emit('removeMyMessageEvent', messageId);
    });
};

// 一意の文字列取得
function getUniqueStr(){
    return new Date().getTime().toString(16) + Math.floor(Math.random()).toString(16);
}