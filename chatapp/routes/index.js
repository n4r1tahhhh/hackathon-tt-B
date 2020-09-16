'use strict';

const express = require('express');
const router = express.Router();

// ログイン画面の表示
router.get('/', function(request, response, next) {
    response.render('index');
});

// チャット画面の表示
router.post('/room', function(request, response, next) {
    console.log('ユーザ名：' + request.body.userName);

    // (未実装) 入室処理
    let correct = false;

    // (未実装) dbからユーザーを取得 (ユーザー名で検索)
    //const user_db;

    // dbに指定されたユーザーが存在するか
    if (true /* user_db !== None */) {

        // (未実装) パスワードハッシュ化
        //const password_hash = request.body.password;
        // (未実装) dbからパスワードを取得
        //const password_db;

        // dbのハッシュパスワードと一致するか
        if (true /* password_hash === password_db */) {
            correct  = true;
        }
    }

    // ユーザー名とパスワードが合っている場合入室
    if (correct) {        
        response.render('room', { userName: request.body.userName });
    }

    // ユーザー名またはパスワードが間違っている
    //flash('ユーザー名またはパスワードが正しくありません。');
    response.render('index', { userName: request.body.userName });
});

// (未実装) 新規登録処理
router.post('/signup', function(request, response, next) {

    if (true /* ユーザー名が存在する -> true */) {    
        //flash('このユーザー名は既に使われています。'); 
        response.render('index', { userName: request.body.userName });
    }

    // (未実装) パスワードハッシュ化
    //const password_hash = request.body.password;
    // (未実装) パスワードをハッシュ化してdbに保存
    

    // 入室
    response.render('room', { userName: request.body.userName });
});

module.exports = router;
