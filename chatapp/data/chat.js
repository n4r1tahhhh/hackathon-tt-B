//SQLite3モジュール
const sqlite = require("sqlite3").verbose();

//データベース接続
const db = new sqlite.Database("./data/Users.sqlite3");
//SQL文を同期的に実行する
db.serialize(() => {
  //テーブルがなれけば「chat」を作成
  db.run('CREATE TABLE IF NOT EXISTS chat(id INTEGER NOT NULL, username TEXT NOT NULL, type TEXT, message TEXT, replyid INTEGER, time DATETIME, PRIMARY KEY (id))')

  //Prepareオブジェクト
  const data = db.prepare('INSERT INTO chat VALUES (?, ?, ?, ?, ?, ?)');
  try {
    data.run([1, "hogehoge", "message", "Hello, world!!", 0, "2020-09-01 00:00:00"]);
    data.run([2, "fuga", "message", "ヤッホー", 0, "2020-09-01 01:00:00"]);
    data.run([3, "hogehoge", "message", "What r u waiting for ?", 0, "2020-09-01 02:00:00"]);
    data.run([4, "John Doe", "message", "Hi", 0, "2020-09-01-03:00:00"]);
  } catch(e){
    logErrors(e);
  }
  

  // 参照
  db.each("SELECT * FROM chat", function (err, row) {
    console.log(row.id + ":" + row.username + ":" + row.type + ":" + row.message + ":" + row.replyid + ":" + row.time);
  });

  //Prepareオブジェクトを閉じる
  data.finalize();
});

//データベースを閉じる
db.close();