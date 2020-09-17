'use strict';

// 退室メッセージをサーバに送信する
function exit() {
    // ユーザ名取得
    let userName = $('#userName').val();
    // < という特殊文字を置換
    userName = userName.replace(/</g, "&lt;");
    // > という特殊文字を置換
    userName = userName.replace(/>/g, "&gt;");
    // 退室メッセージイベントを送信する
    socket.emit('exitMyselfEvent', userName);
    // 退室
    location.href = '/';

}

// サーバから受信した退室メッセージを画面上に表示する
socket.on('exitOtherEvent', function (data) {
    let $box = $('<div class="message-box"></div>').prependTo($('#thread'));
    $box.append('<pre class="text-success">' + data['userName'] + 'さんが退室しました。' + '</pre>');

    // 接続中のユーザを画面上に表示
    const userNameList = data['userNameList'];
    document.getElementById("userNameList").innerHTML = '';
    for (let i = 0; i < userNameList.length; i++ ) {
        if (userNameList[i] != userName) {
            document.getElementById("userNameList").innerHTML += '<option value="' + userNameList[i] + '">' + userNameList[i] + '</option>';
        }
    }
});
