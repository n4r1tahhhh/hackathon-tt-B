//SQLite3モジュール
const sqlite = require("sqlite3").verbose();

//データベース接続
const db = new sqlite.Database("./data/Users.sqlite3");
//SQL文を同期的に実行する
db.serialize(() => {
  //テーブルがなれけば「user」を作成
  db.run('CREATE TABLE IF NOT EXISTS user(id INTEGER, username TEXT NOT NULL, time DATETIME, PRIMARY KEY (id))')

  //Prepareオブジェクト
  const data = db.prepare('INSERT INTO user VALUES (?, ?, ?)');
  try {
    data.run([1, "hogehoge", "2020-09-01 00:00:00"]);
    data.run([2, "fuga", "2020-09-02 00:00:00"]);
    data.run([3, "John Doe", "2020-09-03 00:00:00"]);
  } catch (e) {
    logErrors(e);
  }
  

  // 参照
  db.each("SELECT * FROM user", function (err, row) {
    console.log(row.id + ":" + row.username + ":" + row.time);
  });

  //Prepareオブジェクトを閉じる
  data.finalize();
});

//データベースを閉じる
db.close();