'use strict';

// 入力されたユーザ名を取得する
let userName = $('#userName').val();
// < という特殊文字を置換
userName = userName.replace(/</g, "&lt;");
// > という特殊文字を置換
userName = userName.replace(/>/g, "&gt;");

if (/\S/.test(userName)) {
    // 入室メッセージをサーバに送信する
    function entry() {
        socket.emit('enterMyselfEvent', userName);
    }
    // 入室メッセージイベントを送信する
    entry();
}



// サーバから受信した入室メッセージを画面上に表示する (自クライアント用)
socket.on('enterMyselfEvent', function (data) {
    let $box = $('<div class="message-box"></div>').prependTo($('#thread'));
    $box.append('<pre class="text-success">' + data + 'さんが入室しました。' + '</pre>');
});

// サーバから受信した入室メッセージを画面上に表示する (他のクライアント用)
socket.on('enterOtherEvent', function (data) {
    let $box = $('<div class="message-box"></div>').prependTo($('#thread'));
    $box.append('<pre>' + data + 'さんが入室しました。' + '</pre>');
});
