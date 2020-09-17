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
        db.run('CREATE TABLE IF NOT EXISTS user(id INTEGER, username TEXT NOT NULL, password TEXT NOT NULL, time DATETIME, PRIMARY KEY (id))');

        // ユーザー名で検索
        db.get(`select * from user where username='${userName}'`, function (err, row) {

            if (row !== undefined) {
                db.close();
                response.render('index', { 
                    userName: request.body.userName,
                    notification: 'このユーザー名は既に使われています。',
                    notification_type: 'text-warning' 
                });
                return;
            }
            else {
                // ユーザーの登録
                // idを自動で割り当てる方法がわからない
                // 日付も未実装
                const data = db.prepare('INSERT INTO user VALUES (?, ?, ?, ?)');
                try {
                    data.run([1, userName, password_hash, "2020-09-01 00:00:00"]);
                } catch(e){
                    logErrors(e);
                }
                data.finalize();
                db.close();
                
                // ログイン画面へ
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

    // 入力されたユーザー名とパスワードが合っているか
    let correct = false; 

    // (未実装) dbからユーザーを取得 (ユーザー名で検索)
    //const user_db;

    // (未実装) dbに指定されたユーザーが存在するか
    if (true /* user_db !== None */) {

        // 入力されたパスワード
        const password = request.body.password;

        // (未実装) dbからユーザーのパスワードを取得
        //const password_db;

        // (未実装) dbのハッシュパスワードと一致するか
        const bcrypt = require('bcrypt');
        if (true /* bcrypt.compareSync(password, password_db) */) {
            correct = true;
        }
    }

    // ユーザー名とパスワードが合っている場合入室
    if (correct) {        
        response.render('room', { userName: request.body.userName });
    }
    // ユーザー名またはパスワードが間違っている場合
    else {
        response.render('index', { 
            userName: request.body.userName, 
            notification: 'ユーザー名またはパスワードが正しくありません。', 
            notification_type: 'text-danger' 
        });
    }
});

module.exports = router;
