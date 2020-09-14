'use strict';

// メッセージを送信する
function publish() {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();

    if (/\S/.test(message)) {
        // 時間を追加
        const date = getDate();
        // 投稿内容を送信
        socket.emit('sendMessageEvent', {message: message, userName: userName, date: date});
        // 投稿内容を空に
        $('#message').val('');
    }
    else {
        alert('メッセージを入力してください');
    }

    return false;
}

// メッセージを取り消す
function removeMessage(messageId) {
    socket.emit('removeMessageEvent', messageId);
}

// メッセージに返信する
function replyMessage(messageId) {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();
    // 時間を追加
    const date = getDate();
    // 返信内容を送信
    socket.emit('replyMessageEvent', messageId, {message: message, userName: userName, date: date});
    // 投稿内容を空に
    $('#message').val('');
}

// サーバから受信した投稿メッセージを画面上に表示する (自分のメッセージ)
socket.on('receiveMyMessageEvent', function (data) {
    $('#thread').prepend('<pre class="text-success" id=' + data.id + '>' + data.userName + 'さん : ' + data.date + '\n' + data.message + '</pre>');
    setContextMenuEvent(data.id, "myMessage");
});

// サーバから受信した投稿メッセージを画面上に表示する (他の人のメッセージ)
socket.on('receiveMessageEvent', function (data) {
    $('#thread').prepend('<pre id=' + data.id + '>' + data.userName + 'さん : ' + data.date + '\n' + data.message + '</pre>');
    setContextMenuEvent(data.id, "otherMessage");
});

// メッセージを取り消す (自分のメッセージ)
socket.on('removeMyMessageEvent', function (messageId) {
    var $class = $('#' + messageId).attr("class") + " text-success";
    $('#' + messageId).text('メッセージを取り消しました。');
    $('#' + messageId).attr("class", $class);
});

// メッセージを取り消す (他の人のメッセージ)
socket.on('removeMessageEvent', function (messageId) {
    var $class = $('#' + messageId).attr("class") + " text-warning";
    $('#' + messageId).text('このメッセージは取り消されました。');
    $('#' + messageId).attr("class", $class);
});

// サーバから受信したリプライメッセージを画面上に表示する (自分のメッセージ)
socket.on('replyMyMessageEvent', function (messageId, data) {
    $('#' + messageId).after('<pre class="reply text-success" id=' + data.id + '>' + data.userName + 'さん : ' + data.date + '\n' + data.message + '</pre>');
    setContextMenuEvent(data.id, "myMessage");
});

// サーバから受信したリプライメッセージを画面上に表示する (他の人のメッセージ)
socket.on('replyMessageEvent', function (messageId, data) {
    $('#' + messageId).after('<pre class="reply" id=' + data.id + '>' + data.userName + 'さん : ' + data.date + '\n' + data.message + '</pre>');
    setContextMenuEvent(data.id, "otherMessage");
});

$(document).on("keypress", $("#message"), function(e) {
    // shift + Enterが押された
    if (e.shiftKey && e.keyCode == 13) { 
        // 改行の入力を中断
        e.preventDefault();
        // 投稿
        publish($("#message"));
    }
});

// メッセージ右クリック時のコンテキストメニュー設定
function setContextMenuEvent(messageId, func) {

    // 右クリックを押された時の処理
    document.getElementById(messageId).addEventListener('contextmenu', function (e){

        // コンテキストメニューを空にする
        $('#contextmenu').empty();
        $('#contextmenu').prepend('<ul></ul>');

        // 自分のメッセージ専用のメニュー
        if (func === "myMessage") {

            // 取り消し機能を追加
            $('#contextmenu').children('ul').append('<li id="remove-message">投稿を取り消す</li>');
            $('#remove-message').attr("onclick", "removeMessage('" + messageId + "');");
        }

        // 他の人のメッセージ専用のメニュー
        else if (func === "otherMessage") {
        }        
        
        // 返信機能を追加
        $('#contextmenu').children('ul').append('<li id="reply-message">投稿に返信する</li>');
        $('#reply-message').attr("onclick", "replyMessage('" + messageId + "');");

        // マウスの位置をstyleへ設定（左上の開始位置を指定）
        document.getElementById('contextmenu').style.left = e.pageX + "px";
        document.getElementById('contextmenu').style.top = e.pageY + "px";
        // メニューをblockで表示させる
        document.getElementById('contextmenu').style.display = "block";
    });

    document.body.addEventListener('click', function (e){
        // メニューを非表示
        document.getElementById('contextmenu').style.display = "none";
        $('#contextmenu').empty();
    });
}
