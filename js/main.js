var database;
var type_results;

function getDatabase(dbName) {
  filename = "sql-wasm.wasm";
  config = {
    locateFile: (filename) => `libs/${filename}`,
  };

  initSqlJs(config).then(function (SQL) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./db/" + dbName, true);
    xhr.responseType = "arraybuffer";
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
        var uInt8Array = new Uint8Array(xhr.response);
        var db = new SQL.Database(uInt8Array);
        console.log(db);
        database = db;
        populateFooterCount();
      }
    };
    xhr.send();
  });
}

function getDatabaseAndType(dbName) {
  filename = "sql-wasm.wasm";
  config = {
    locateFile: (filename) => `libs/${filename}`,
  };

  initSqlJs(config).then(function (SQL) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "./db/" + dbName, true);
    xhr.responseType = "arraybuffer";
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
        var uInt8Array = new Uint8Array(xhr.response);
        var db = new SQL.Database(uInt8Array);
        console.log(db);
        database = db;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const type = urlParams.get("type");
        var result = database.exec(
          `SELECT * FROM games WHERE \`type\` = "${type}" ORDER BY \`name\` ASC`
        );
        type_results = result;
        populateFooterCount();

        /* Populate */
        var title = document.getElementById("page-title");
        title.innerText += ": " + type + " Games";
        var count = document.getElementById("result-count");
        count.innerText = result[0].values.length + " result(s) found.";
        var table_body = document.getElementById("table-body");
        result[0].values.forEach(game => {
            var row = document.createElement('tr');
            var name = document.createElement('td');
            name.innerText = game[1];
            row.appendChild(name);
            var min_players = document.createElement('td');
            min_players.innerText = game[2];
            row.appendChild(min_players);
            var max_players = document.createElement('td');
            if(game[3]) {
              max_players.innerText = game[3];
            } else {
              max_players.innerHTML = '&#8212;';
            }
            row.appendChild(max_players);
            var length = document.createElement('td');
            length.innerText = game[4];
            row.appendChild(length);
            table_body.appendChild(row);
        });
      }
    };
    xhr.send();
  });
}

function randomQuery() {
  try {
    var stmt = database.exec("SELECT * FROM games WHERE id > (ABS(RANDOM()) % (SELECT max(id) FROM games)) LIMIT 1");
    return stmt;
  } catch (err) {
    return false;
  }
}

function getPlayerString(min_players, max_players) {
  if (max_players && max_players > min_players) {
    return min_players + " - " + max_players;
  } else if (max_players && max_players === min_players) {
    return min_players;
  } else {
    return min_players + "+";
  }
}

function getAllRecords() {
  try {
    var result = database.exec("SELECT * FROM games");
    return result;
  } catch (err) {
    return false;
  }
}

function populateFooterCount() {
  const footer_paragraph = document.getElementById('db-count');
  var result = getAllRecords();
  if (result !== false) {
    footer_paragraph.innerHTML = "<b>Number of Games: </b>" + result[0].values.length;
  }
}
