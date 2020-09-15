'use strict';

module.exports = function (socket, io, xssFilters, marked, hljs) {
    // コードのハイライトがなぜか出来ない
    marked = marked_js_render(marked, hljs);
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        if (!data) {
            return
        }

        // 投稿に一意のidを付与する
        data["id"] = getUniqueStr();
        // userNameのタグを無効化（XSS脆弱性の対策）
        data["userName"] = xssFilters.inHTMLData(data["userName"]);
        // メッセージのタグを無効化（XSS脆弱性の対策）
        data["message"] = xssFilters.inHTMLData(data["message"]);
        // markdown化
        data["message"] = marked(data["message"]);

        socket.broadcast.emit('receiveMessageEvent', data);
        socket.emit('receiveMyMessageEvent', data);
    });
    // 投稿メッセージを取り消す
    socket.on('removeMessageEvent', function (messageId) {
        if (!messageId) {
            return
        }
        socket.broadcast.emit('removeMessageEvent', messageId);
        socket.emit('removeMyMessageEvent', messageId);
    });
    // 投稿メッセージに返信する
    socket.on('replyMessageEvent', function (messageId, data) {
        if (!messageId || !data) {
            return
        }

        // 投稿に一意のidを付与する
        data["id"] = getUniqueStr();
        // userNameのタグを無効化（XSS脆弱性の対策）
        data["userName"] = xssFilters.inHTMLData(data["userName"]);
        // メッセージのタグを無効化（XSS脆弱性の対策）
        data["message"] = xssFilters.inHTMLData(data["message"]);
        // markdown化
        data["message"] = marked(data["message"]);

        socket.broadcast.emit('replyMessageEvent', messageId, data);
        socket.emit('replyMyMessageEvent', messageId, data);
    });
};

// 一意の文字列取得
function getUniqueStr(){
    return new Date().getTime().toString(16) + Math.floor(Math.random()).toString(16);
}

// コードのハイライト
function marked_js_render(marked, hljs) {
    // marked.js + highlight.js
    var renderer = new marked.Renderer()

    // code syntax hilightの編集
    renderer.code = function (code, language) {
        return '<pre><code class="hljs">' + hljs.highlightAuto(code).value + '</code></pre>';
    };
    // tableタグ
    renderer.table = function (header, body) {
        if (body) body = '<tbody>' + body + '</tbody>';

        return '<table class="table table-hover">\n'
            + '<thead>\n'
            + header
            + '</thead>\n'
            + body
            + '</table>\n';
    };
    marked.setOptions({
        renderer: renderer,
    });
    return marked;
}