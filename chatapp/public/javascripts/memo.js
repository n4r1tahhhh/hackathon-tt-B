'use strict';

// メモを画面上に表示する
function memo() {
    // ユーザ名を取得
    const userName = $('#userName').val();

    // 入力されたメッセージを取得
    var message = $('#message').val();
    
    // 時間をメッセージに追加
    message = getDate() + ' | ' + message;

    // スペースや改行などの見えない文字以外があるか 
    if(/\S/.test(message)) {
        // 正しく改行して表示
        const lines = message.split(/\n/); 

        // メモの内容を表示
        for (var i = 0; i < lines.length; i++) {
            $('#thread').prepend('<pre>' + lines[i] + '</pre>');
        }

    } else {
        alert('メモを入力してください！');
    }

    return false;
}
