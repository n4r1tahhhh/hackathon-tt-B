'use strict';

// メモを画面上に表示する
function memo() {
    // ユーザ名を取得
    const userName = $('#userName').val();

    // 入力されたメッセージを取得
    var message = $('#message').val();
    $('#message').val('');

    // 時間をメッセージに追加
    message = userName + 'さんのメモ : ' + getDate() + '\n' + message;

    // スペースや改行などの見えない文字以外があるか 
    if(/\S/.test(message)) {
        // 改行を正しく表示
        $('#thread').prepend('<pre>' + message + '</pre>');
    } else {
        alert('メモを入力してください！');
    }

    return false;
}
