'use strict';

module.exports = function (socket, xssFilters) {
    // 退室メッセージをクライアントに送信する
    socket.on('exitMyselfEvent', function (data) {
        data = xssFilters.inHTMLData(data);

        // 接続しているユーザのリストから消去
        for (let i = 0; i < userList.length; i++) {
            if (userList[i]['userName'] == data ) {
                userList = userList.slice(0, i).concat(userList.slice(i + 1, userList.length));
            }
        }

        var userNameList = [];
        for (let i = 0; i < userList.length; i++) {
            userNameList.push(userList[i]['userName']);
        }

        data = {
            userName: data,
            userNameList: userNameList
        }

        socket.broadcast.emit('exitOtherEvent', data);
    });
};
