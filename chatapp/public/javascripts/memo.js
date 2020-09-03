'use strict';

// メモを画面上に表示する
function memo() {
    // ユーザ名を取得
    const userName = $('#userName').val();;

    // 入力されたメッセージを取得
    const message = $('#message').val();
    
    if(message == ""){
        alert('メモを入力してください！');
    }else{
        $('#thread').prepend('<pre>' + message + '</pre>');
    }

    return false;
}
