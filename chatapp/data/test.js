// sqlite3を使う準備
var sqlite3 = require("sqlite3").verbose();
// :memory:を指定すると揮発性のDBができる。
// DBファイルを指定する事で、永続化したDBを扱う事もができる。
var db = new sqlite3.Database(":memory:");

// serialize関数を使うと、
// それぞれの行が実行されたら、次の行が実行される。
// parallel関数を用いることで、平行実行もできる。
db.serialize(function () {

  // // テーブルを作成する。
  // db.run("CREATE TABLE team (info TEXT)");

  // // データを登録する。
  // var stmt = db.prepare("INSERT INTO team VALUES (?)");
  // for (var i = 0; i < 10; i++)
  //   stmt.run("team " + i);
  // stmt.finalize();

  // // データを更新する。
  // var stmt2 = db.prepare("UPDATE team SET info = ? WHERE info = ?");
  // for (var i = 0; i < 10; i += 3)
  //   stmt2.run("team 10" + i, "team " + i);
  // stmt2.finalize();

  // //参照する。
  // // 参照用関数は他にもあるが、今回は取得したものを1件ずつ扱うeach関数を利用する。
  // // 引数(row)のプロパティに、SELECT句で指定した要素があるので、
  // // たとえば「row.info」といったアクセスで値を取り出せる。
  // db.each("SELECT rowid AS id, info FROM team", function (err, row) {
  //   console.log(row.id + " : " + row.info);
  // });
});

// DBを閉じる。
db.close();