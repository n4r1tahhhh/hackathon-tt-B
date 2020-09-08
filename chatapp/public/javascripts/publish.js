'use strict';

// 投稿メッセージをサーバに送信する
function publish() {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val();

    if (/\S/.test(message)) {
        // 時間を追加
        const date = getDate();
        // 投稿内容を送信
        sendMessage({message: message, userName: userName, date: date});
        // 投稿内容を空に
        $('#message').val('');
    }
    else {
        alert('メッセージを入力してください');
    }

    return false;
}

// メッセージを送信する
function sendMessage(data) {
    socket.emit('sendMessageEvent', data);
}

// メッセージを取り消す
function removeMessage(messageId) {
    socket.emit('removeMessageEvent', messageId);
}

// サーバから受信した投稿メッセージを画面上に表示する (自分のメッセージ)
socket.on('recieveMyMessageEvent', function (data) {
    $('#thread').prepend('<pre class="text-success" id=' + data.id + '>' + data.userName + 'さん : ' + data.date + '\n' + data.message + '</pre>');
    setContextMenuEvent(data.id);
    console.log(data);
});

// サーバから受信した投稿メッセージを画面上に表示する (他の人のメッセージ)
socket.on('recieveMessageEvent', function (data) {
    $('#thread').prepend('<pre id=' + data.id + '>' + data.userName + 'さん : ' + data.date + '\n' + data.message + '</pre>');
    console.log(data);
});

// サーバから受信した投稿メッセージを画面上に表示する (自分のメッセージ)
socket.on('removeMyMessageEvent', function (messageId) {
    document.getElementById(messageId).innerHTML　= '<pre class="text-warning">メッセージを取り消しました。</pre>';
}); 

// サーバから受信した投稿メッセージを画面上に表示する (他の人のメッセージ)
socket.on('removeMessageEvent', function (messageId) {
    document.getElementById(messageId).innerHTML　= '<pre class="text-warning">このメッセージは取り消されました。</pre>'
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

//　メッセージ右クリック時のコンテキストメニュー設定
function setContextMenuEvent(messageId) {
    document.getElementById(messageId).addEventListener('contextmenu',function (e){
        // 取り消し処理関数を設定
        document.getElementById('remove-message').setAttribute('onclick',　'removeMessage("' + messageId + '");');
        // マウスの位置をstyleへ設定（左上の開始位置を指定）
        document.getElementById('contextmenu').style.left = e.pageX + "px";
        document.getElementById('contextmenu').style.top = e.pageY + "px";
        // メニューをblockで表示させる
        document.getElementById('contextmenu').style.display = "block";
    });
    document.body.addEventListener('click',function (e){
        // メニューをnoneで非表示にさせる
        document.getElementById('contextmenu').style.display = "none";
    });
}