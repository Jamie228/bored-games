getDatabase('games.db');

        var random_button = document.getElementById('random-button');
        random_button.addEventListener('click', function() {
            var result = randomQuery();
            //Query Successful?
            if (result !== false) {
                //Get result div
                var results = document.getElementById('result');
                //console.log(result[0].values);
                //Create title dynamically
                results.innerHTML = "<h2>" + result[0].values[0][1] + "</h2>";
                //Create game info wrapper (flex)
                game_info_div = document.createElement('div');
                game_info_div.className = "game-info";
                //No. of players
                players = document.createElement('div');
                players.innerHTML = '<h2><i class="fas fa-users"></i></h2><h3>' + getPlayerString(result[0].values[0][2], result[0].values[0][3]) + "</h3>";
                //Length
                time = document.createElement('div');
                time.innerHTML = '<h2><i class="fas fa-clock"></i></h2><h3>' + result[0].values[0][4] + "</h3>";
                //Type
                type = document.createElement('div');
                type.innerHTML = '<h2><i class="fas fa-chess"></i></h2><h3>' + result[0].values[0][5] + "</h3>";
                //Append to wrapper
                game_info_div.appendChild(players);
                game_info_div.appendChild(time);
                game_info_div.appendChild(type);
                //Append wrapper
                results.appendChild(game_info_div);
                //Animate
                results.style.maxHeight = '500px';
                results.className = "expanded";
                //Jump
                window.location.hash = 'result';
            }
        });