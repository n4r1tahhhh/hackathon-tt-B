'use strict';

// メモを画面上に表示する
function memo() {
    // ユーザ名を取得
    let userName = $('#userName').val();
    // < という特殊文字を置換
    userName = userName.replace(/</g, "&lt;");
    // > という特殊文字を置換
    userName = userName.replace(/>/g, "&gt;");

    // 入力されたメッセージを取得
    let message = $('#message').val();
    // < という特殊文字を置換
    message = message.replace(/</g, "&lt;");
    // > という特殊文字を置換
    message = message.replace(/>/g, "&gt;");
    $('#message').val('');

    // スペースや改行などの見えない文字以外があるか 
    if (/\S/.test(message)) {
        // 時間をメッセージに追加
        message = userName + 'さんのメモ : ' + getDate() + '\n' + message;

        // 改行を正しく表示
        $('#memo-thread').prepend('<pre>' + message + '</pre>');
    } else {
        alert('メモを入力してください！');
    }

    return false;
}
