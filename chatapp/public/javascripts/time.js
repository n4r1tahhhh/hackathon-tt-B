
// 時間を取得して文字列として返す
function getDate() {
    const date = new Date();
    var now = date.getFullYear() + '/' + (date.getMonth()+1) + '/' +  date.getDate();
    now += ' ' + date.getHours() + ':' + date.getMinutes() + ':' +  date.getSeconds();
    return now;
}
