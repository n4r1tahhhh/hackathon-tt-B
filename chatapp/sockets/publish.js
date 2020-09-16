'use strict';

module.exports = function (socket, io, xssFilters) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        if (!data) {
            return
        }

        // 投稿に一意のidを付与する
        data["id"] = getUniqueStr();
        // メッセージのタグを無効化（XSS脆弱性の対策）
        data["message"] = xssFilters.inHTMLData(data["message"]);

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

    // 特定のユーザにメッセージを送信
    socket.on('sendMessageToIndividual', function (data) {
        if (!data) {
            return
        }
        var targetUserId = '';
        for (int i = 0; i < userList.length; i++) {
            if (userList[i].userName == data.targetUserName) {
                targetUserId = userList[i].
            }
        }
        const targetUserId = userList[]
        socket.broadcast.to(socket.id).emit('recieveMyMessageEvent', data);
    });
};

// 一意の文字列取得
function getUniqueStr(){
    return new Date().getTime().toString(16) + Math.floor(Math.random()).toString(16);
}

