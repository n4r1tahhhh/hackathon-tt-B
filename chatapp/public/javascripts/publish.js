'use strict';

// 投稿メッセージをサーバに送信する
function publish() {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    var message = $('#message').val();
    $('#message').val('');

    if (/\S/.test(message)) {
        // 時間をメッセージに追加
        message = getDate() + '\n' + message;

        // 投稿内容を送信
        sendMessage({message: message, userName: userName});
    }
    else {
        alert('メッセージを入力してください');
    }

    return false;
}

// メッセージを入力する
function sendMessage(message) {
    //const message = prompt('メッセージを入力してください。\n' +
        //'このメッセージはすべてのクライアントに送信されます。');

    // メッセージ入力イベント（sendMessageEvent）を送信する
    socket.emit('sendMessageEvent', message);

}

// サーバから受信した投稿メッセージを画面上に表示する (自分のメッセージ)
socket.on('recieveMyMessageEvent', function (data) {
    $('#thread').prepend('<pre class="text-success">' + data.userName + 'さん : ' + data.message + '</pre>');
    console.log(data);
});

// サーバから受信した投稿メッセージを画面上に表示する (他の人のメッセージ)
socket.on('recieveMessageEvent', function (data) {
    $('#thread').prepend('<pre>' + data.userName + 'さん : ' + data.message + '</pre>');
    console.log(data);
});

var $ta = $("#message");

$(document).on("keypress", $ta, function(e) {
    // shift + Enterが押された
    if (e.shiftKey && e.keyCode == 13) { 
        // 改行の入力を中断
        e.preventDefault();
        // 投稿
        publish($ta);
    }
});
