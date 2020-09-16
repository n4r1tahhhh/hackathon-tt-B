'use strict';

// チャットルームに入室する
function enter() {
    // 入力されたユーザ名を取得する
    const userName = $('#userName').val();

    // ユーザ名が未入力でないかチェックする
    if (/\S/.test(userName) === false) {
        window.alert('名前を入力してください。');
        $('#userName').val('');
        return;
    }

    // ログイン処理へ
    $('form').submit();
}

// 新規登録
function signup() {
    // 入力されたユーザ名を取得する
    const userName = $('#userName').val();

    // ユーザ名が未入力でないかチェックする
    if (/\S/.test(userName) === false) {
        window.alert('名前を入力してください。');
        $('#userName').val('');
        return;
    }

    // 新規登録申請
    $('form').submit();

}

$(document).on("keypress", $("#userName"), function(e) {
    // Enterが押された
    if (e.keyCode == 13) {
        enter();
        // submitを中断
        e.preventDefault();
    }
});