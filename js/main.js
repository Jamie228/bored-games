var database;
function getDatabase(dbName) {

    filename = "sql-wasm.wasm";
    config = {
        locateFile: filename => `libs/${filename}`
    };

    initSqlJs(config).then(function (SQL) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', './db/' + dbName, true);
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var uInt8Array = new Uint8Array(xhr.response);
                var db = new SQL.Database(uInt8Array);
                console.log(db);
                database = db;
            }
        }
        xhr.send();
    });
}

function randomQuery() {
    try {
        var stmt = database.exec('SELECT * FROM games ORDER BY RANDOM() LIMIT 1');
        return stmt;
    } catch (err) {
        return false;
    }
}

function getPlayerString(min_players, max_players) {
    if(max_players && max_players > min_players) {
        return min_players + " - " + max_players;
    } else if (max_players && max_players === min_players) {
        return min_players;
    } else {
        return min_players + "+";
    }
}