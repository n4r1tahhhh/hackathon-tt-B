'use strict';

const express = require('express');
const router = express.Router();

// ログイン画面の表示
router.get('/', function(request, response, next) {
    response.render('index');
});

// 新規登録処理
router.post('/signup', function(request, response, next) {

    // 入力データ
    const userName = request.body.userName;
    const password = request.body.password;

    // ハッシュ化
    const bcrypt = require('bcrypt');
    const password_hash = bcrypt.hashSync(password, 10);

    //データベース接続
    const sqlite = require("sqlite3").verbose();
    const db = new sqlite.Database("./data/Users.sqlite3");

    // ユーザー名が既に使われているか
    db.serialize(() => {

        // テーブルがなれけば「user」を作成
        db.run('CREATE TABLE IF NOT EXISTS user(username TEXT NOT NULL, password TEXT NOT NULL, time DATETIME, PRIMARY KEY (username))');

        // ユーザー名で検索
        db.get(`select * from user where username='${userName}'`, function (err, row) {

            // ユーザー名が既に使われている場合
            if (row !== undefined) {

                db.close();
                response.render('index', {
                    userName: request.body.userName,
                    notification: 'このユーザー名は既に使われています。',
                    notification_type: 'text-warning'
                });
                return;
            }
            // ユーザー名がまだ使われていない場合
            else {

                // 日付の取得
                var date = new Date();
                var sqliteDate = date.toISOString();

                const data = db.prepare('INSERT INTO user VALUES (?, ?, ?)');
                try {
                    data.run([userName, password_hash, sqliteDate]);
                } catch(e){
                    logErrors(e);
                }
                data.finalize();
                db.close();

                response.render('index', {
                    userName: request.body.userName,
                    notification: '新規登録しました。',
                    notification_type: 'text-success'
                });
                return;
            }
        });
    });
});

// チャット画面の表示
router.post('/room', function(request, response, next) {

    // 入力データ
    const userName = request.body.userName;
    const password = request.body.password;

    //データベース接続
    const sqlite = require("sqlite3").verbose();
    const db = new sqlite.Database("./data/Users.sqlite3");

    // ユーザー名が既に使われているか
    db.serialize(() => {

        // ユーザー名で検索
        db.get(`select password from user where username='${userName}'`, function (err, row) {

            db.close();

            // ユーザーがdbに存在するか
            if (row !== undefined) {

                const password_db = row.password;

                // パスワードのハッシュ値がdbに保存してあるハッシュ値と同じであれば入室
                const bcrypt = require('bcrypt');
                if (bcrypt.compareSync(password, password_db)) {
                    response.render('room', { userName: request.body.userName });
                    return;
                }
            }

            response.render('index', {
                userName: request.body.userName,
                notification: 'ユーザー名またはパスワードが異なります。',
                notification_type: 'text-warning'
            });
        });
    });
});

module.exports = router;
