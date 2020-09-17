//SQLite3モジュール
const sqlite = require("sqlite3").verbose();

//データベース接続
const db = new sqlite.Database("./data/Users.db");
//SQL文を同期的に実行する
db.serialize(() => {
  // 参照
  db.each("SELECT * FROM chat", function (err, row) {
    console.log(row.id + ":" + row.username + ":" + row.type + ":" + row.message + ":", row.replyid);
  });

  //Prepareオブジェクトを閉じる
  //data.finalize();
});

//データベースを閉じる
db.close();