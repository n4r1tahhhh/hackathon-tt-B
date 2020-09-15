'use strict';

module.exports = function (socket, io, xssFilters, marked, hljs) {
    // コードのハイライト
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
        // コード内ならそのまま、そうでないならメッセージのタグを無効化（XSS脆弱性の対策）
        data["message"] = message_in_code(data["message"], xssFilters);
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
        // コード内ならそのまま、そうでないならメッセージのタグを無効化（XSS脆弱性の対策）
        data["message"] = message_in_code(data["message"], xssFilters);
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

// コードの場合、xssFilterを不適応
function message_in_code(message, xssFilters) {
    let new_message = "";
    let lines = message.split(/\r\n|\r|\n/);
    var headline = [];
    var in_code = false;
    for (var it in lines) {
        if (lines[it].match(/^```.?/)) {
            // コードの行内の場合は外す
            in_code = in_code ? in_code : !in_code;
        } else if (lines[it].match(/^`.?/)) {
            // コードの行内の場合は外す
            in_code = in_code ? in_code : !in_code;
        }
        if (!in_code) {
            // コードの中でない場合はxss脆弱性対策
            headline.push(xssFilters.inHTMLData(lines[it]));
            continue;
        }
        headline.push(lines[it]);
    }
    new_message = headline.join('\n');
    return new_message;
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