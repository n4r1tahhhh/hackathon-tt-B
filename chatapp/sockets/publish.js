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
        // targetUserNameのタグを無効化（XSS脆弱性の対策）
        data["targetUserName"] = xssFilters.inHTMLData(data["targetUserName"]);
        // sendDMのタグを無効化（XSS脆弱性の対策）
        data["sendDM"] = (xssFilters.inHTMLData(data["sendDM"]) === 'true');
        // コード内ならそのまま、そうでないならメッセージのタグを無効化（XSS脆弱性の対策）
        data["message"] = message_in_code(data["message"], xssFilters);
        // markdown化
        data["message"] = marked(data["message"]);

        // (未実装) dbに投稿を保存
        const sqlite = require("sqlite3").verbose();
        const db = new sqlite.Database('./data/Users.sqlite3');
        db.serialize(() => {
            //テーブルがなれけば「chat」を作成
            db.run('CREATE TABLE IF NOT EXISTS chat(id INTEGER NOT NULL, username TEXT NOT NULL, type TEXT, message TEXT, replyid INTEGER, time DATETIME, PRIMARY KEY (id))');

            db.get(`select * from user where username='${data["userName"]}'`, function (err, row) {
                if (row !== undefined) {
                    db.close();
                    console.log("ユーザ名が違います！！");
                } else {
                    const dat = db.prepare('INSERT INTO chat VALUES (?, ?, ?, ?, ?, ?)');
                    try {
                        dat.run([Number(data["id"]), data["userName"], "message", data["message"], 0, "2020-09-01 00:00:00"]);
                    } catch (e) {
                        console.log(e);
                        console.log("投稿失敗");
                    }
                    dat.finalize();
                    db.close();
                }
            });
        });

        console.log(data['sendDM']);
        console.log(userList);

        if (data['sendDM']) {
            for (var i = 0; i < userList.length; i++) {
                // userNameが一致する人のsocketidの人に向けてメッセージ送信
                if (data['targetUserName'] == userList[i]['userName']) {
                    const targetUserId = userList[i]['socketId'];
                    socket.broadcast.to(targetUserId).emit('receiveMessageEvent', data);
                    break;
                }
            }
        } else {
            console.log('aaaa');
            socket.broadcast.emit('receiveMessageEvent', data);
            socket.broadcast.emit('recieveMyMessageEvent', data);
        }
    });

    // 投稿メッセージを取り消す
    socket.on('removeMessageEvent', function (messageId) {
        if (!messageId) {
            return
        }

        // (未実装) dbから投稿を削除(or取り消しメッセージに変更)
        const sqlite = require("sqlite3").verbose();
        const db = new sqlite.Database('./data/Users.sqlite3');
        db.serialize(() => {
            //テーブルがなれけば「chat」を作成
            db.run('CREATE TABLE IF NOT EXISTS chat(id INTEGER NOT NULL, username TEXT NOT NULL, type TEXT, message TEXT, replyid INTEGER, time DATETIME, PRIMARY KEY (id))');

            db.get(`select * from user where id='${Number(messageId)})'`, function (err, row) {
                if (row !== undefined) {
                    db.close();
                    console.log("IDが違います！！");
                } else {
                    const dat = db.prepare('UPDATE chat SET type = ? WHERE id = ?');
                    try {
                        dat.run(["delete", Number(messageId)]);
                    } catch (e) {
                        console.log(e);
                        console.log("投稿取り消し失敗");
                    }
                    dat.finalize();
                    db.close();
                }
            });
        });

        socket.broadcast.emit('removeMessageEvent', messageId);
        socket.emit('removeMyMessageEvent', messageId);
    });

    // 特定のユーザにdmメッセージを送信
    socket.on('sendMessageToIndividual', function (data) {
        if (!data) {
            return
        }

        for (var i = 0; i < userList.length; i++) {
            // userNameが一致する人のsocketidの人に向けてメッセージ送信
            if (data['userName'] == userList[i]['userName']) {
                const targetId = userList[i]['socketId'];
                socket.broadcast.to(targetUserId).emit('recieveMyMessageEvent', data);
            }
        }
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

        // (未実装) dbにリプライを保存
        const sqlite = require("sqlite3").verbose();
        const db = new sqlite.Database('./data/Users.sqlite3');
        db.serialize(() => {
            //テーブルがなれけば「chat」を作成
            db.run('CREATE TABLE IF NOT EXISTS chat(id INTEGER NOT NULL, username TEXT NOT NULL, type TEXT, message TEXT, replyid INTEGER, time DATETIME, PRIMARY KEY (id))');

            db.get(`select * from user where id='${Number(messageId)}'`, function (err, row) {
                if (row !== undefined) {
                    db.close();
                    console.log("IDが違います！！");
                } else {
                    const dat = db.prepare('INSERT INTO chat VALUES (?, ?, ?, ?, ?, ?)');
                    try {
                        dat.run([Number(data["id"]), data["userName"], "reply", data["message"], messageId, "2020-09-01 00:00:00"]);
                    } catch (e) {
                        console.log(e);
                        console.log("リプライ失敗");
                    }
                    dat.finalize();
                    db.close();
                }
            });
        });

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
