let WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8981})

console.log('Server started on 8981')


let players = []
currentPlayer = 0

let monsters = []
monsters[0] = {}
monsters[0]["sprite"] = 0
monsters[0]["square"] = 48
monsters[0]["life"] = 3
monsters[0]["attack"] = 6
monsters[0]["defence"] = 8
monsters[0]["alive"] = true
monsters[0]["nick"] = "Biffy the Wild"

next_monster_id = 1

let king_name = "Biffy the Wild"

let start_x = 0
let start_y = 0

let next_player_id = 0

let squares = 48 // 1 to 48

let map = []
map[0] = {}
map[0]["players"] = []
map[0]["event"] = {}
// 0 is "outside"

let turn = 0

let users = {}

let gameNumber = 0
let earliestOnGoingGame = 0

wss.on('connection', function(ws, req) {
    //ws.upgradeReq = req

    //console.log(req.connection.remoteAddress)

    //var user = ws.upgradeReq.headers['sec-websocket-key']
    var user = req.connection.remoteAddress
    console.log("user:" + user)
//    console.log('connected: ' + ws.upgradeReq.headers['sec-websocket-key']);
    if (user in users) {
        users[user]["ws"] = ws
        users[user]["active"] = true
        let payload = new Object()
        payload["status"] = "registered"
        payload["myId"] = users[user]["id"]
        payload["state"] = players[users[user]["id"]]["state"]
        ws.send(JSON.stringify(payload))
        console.log("user already registered?")
    }
    else {
        users[user] = {}
        users[user]["ws"] = ws
        users[user]["active"] = true
        users[user]["state"] = 0 
        // 0 = reg but not started
        // 1 = started; move
        // 2 = started; attack
        // 10 = dead; ready for restart
        // 

        users[user]["id"] = next_player_id

        let payload = new Object()
        payload["status"] = "registered"
        payload["myId"] = next_player_id
        console.log("registration: #" + " (" + user + ")")
        ws.send(JSON.stringify(payload))
        players[next_player_id] = {}
        players[next_player_id]["alive"] = false
        players[next_player_id]["state"] = 0
        next_player_id++
    }

    ws.on('message', function(message) {       
        let incomingMsg = JSON.parse(message);
        if (user in users) {
            
            console.log("action from #" + users[user]["id"] + " (current nick: " + users[user].nick + ") " + ": " + incomingMsg.action + " [" + incomingMsg.nick + "]")
            for ( a in incomingMsg) { console.log(a + ": " + incomingMsg[a])}

            if (incomingMsg.nick == null || incomingMsg.nick == undefined || incomingMsg.nick == "" || incomingMsg["nick"] == undefined) {
                if (users[user] != undefined && (players[users[user]["id"]].nick == null || players[users[user]["id"]].nick == undefined || players[users[user]["id"]].nick == "" || players[users[user]["id"]].nick == undefined)) {
                    players[users[user]["id"]].nick = "Redgar"
                }
            }
            else {
                players[users[user]["id"]].nick = incomingMsg.nick
                console.log(user + " setNick to : " + players[users[user]["id"]].nick)
            }


            players[users[user]["id"]]["action"] = incomingMsg.action;
            console.log(incomingMsg.action);

        }
        else {
            console.log("action from unknown user (" + user + "): " + incomingMsg.action)
        }

        
        
    });
});



let fs = require('fs')

let arg = process.argv[2]

function getDateTime() {

    let date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    let year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    let day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;

}


//The maximum is INCLUSIVE and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min;
}



function distanceBetweenTwoPoints(a, b) {
    var xs = b.x - a.x;
    xs = xs * xs;

    var ys = b.y - a.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}

function process_and_send_events() {
    turn++;
    var squares_occupied = []
    // next_player_id
    for(var i=0; i<players.length; i++) {
//console.log(players[i])
        players[i].outcome = "";
        if (players[i].action == "next") {
            //restart:
            if (!players[i]["alive"]) {
                players[i]["alive"] = true
                players[i]["action"] = ""
                players[i]["square"] = 0
                players[i]["attack"] = 5
                players[i]["defence"] = 7
                players[i]["life"] = 3
                players[i]["maxLife"] = 3
                players[i]["state"] = 1
                players[i]["sprite"] = getRandomInt(0,1)
                
            }
            else {


                var newSquare = players[i]["square"]+1
                var collision = null

                for(monster in monsters) {
                    if (monsters[monster]["alive"] && monsters[monster]["square"] == newSquare) {
                        collision = monster
                    }
                }
                if (collision != null ) {
                    var monster = collision
                    players[i]["state"] = 2
                    var d6 = getRandomInt(1, 6)
                    if (d6 == 1) {
                        players[i].outcome = 0
                    }
                    else if (d6 == 6 || players[i]["attack"] + d6 > monsters[monster]["defence"]) { 
                        monsters[monster]["life"]--  
                        if (monsters[monster]["life"] < 1) {
                            monsters[monster]["alive"] = false
                        }
                        players[i].outcome = 1
                    }
                    d6 = getRandomInt(1, 6)
                    if (d6 == 1 || !monsters[monster]["alive"]) {
                        players[i].outcome += 2
                    }
                    else if (d6 == 6 || monsters[monster]["attack"] + d6 > players[i]["defence"]) { 
                        players[i]["life"]--
                        if (players[i]["life"] < 1) {
                            players[i]["alive"] = false
                            players[i]["state"] = 3
                        }
                    }
                    players[i].outcome += 4
                }
                else {
                    var d6 = 1// getRandomInt(1, 6)
                    //actually just move 1 at a time
                    players[i]["state"] = 1
                    for(var dest = 1; dest<=d6; dest++) {
                        players[i]["square"]++
                        collision = null
                        for(monster in monsters) {
                            if (monsters[monster]["alive"] && monsters[monster]["square"] == players[i]["square"]+1) {
                                dest = d6+1
                            }
                        }
                    }
                    
                    if (players[i]["square"] > 47) {
                        players[i]["alive"] = false
                        players[i]["state"] = 10
                        monsters[next_monster_id] = {}
                        monsters[0]["sprite"] = players[i]["sprite"]
                        monsters[0]["square"] = 48
                        monsters[0]["life"] = players[i]["life"]
                        monsters[0]["attack"] = players[i]["attack"]
                        monsters[0]["defence"] = players[i]["defence"]
                        monsters[0]["alive"] = true
                        monsters[0]["nick"] = players[i]["nick"]
                        king_name = players[i]["nick"]
                    }
                }

                collision = null
                if (players[i]["alive"]) {
                    for(monster in monsters) {
                        if (monsters[monster]["alive"] && monsters[monster]["square"] == players[i]["square"]+1) {
                            collision = monster
                        }
                    }
                    if (collision != null ) {
                        players[i]["state"] = 2
                    }
                    else {
                        players[i]["state"] = 1
                    }
                }
            }
        }
        if (players[i]["alive"]) {
            squares_occupied.push(players[i]["square"])
        }
        players[i].action = "";
        
    }
    console.log("squares_occupied" + squares_occupied)
    var squares_affected = []

    for(var i=0; i<squares_occupied.length; i++) {
        switch(squares_occupied[i]) {
            case 1:
                squares_affected.push(2)
                squares_affected.push(5)
                squares_affected.push(8)
                squares_affected.push(11)
                squares_affected.push(16)
                squares_affected.push(20)
                squares_affected.push(27)
                squares_affected.push(33)
                squares_affected.push(36)
                break
            case 2:
				squares_affected.push(1)
                squares_affected.push(31)
                break
            case 5:
                squares_affected.push(35)
                squares_affected.push(41)
                squares_affected.push(19)
                break
            case 8:
                squares_affected.push(23)
                squares_affected.push(24)
                squares_affected.push(25)
                break
            case 11:
                squares_affected.push(29)
                squares_affected.push(37)
                break
            case 16:
                squares_affected.push(14)
                squares_affected.push(15)
                squares_affected.push(17)
                squares_affected.push(18)
                break
            case 20:
                squares_affected.push(42)
                break
            case 27:
                squares_affected.push(13)
                squares_affected.push(38)
                squares_affected.push(44)
                break
            case 33:
                squares_affected.push(3)
                squares_affected.push(21)
                squares_affected.push(43)
                squares_affected.push(47)
                break
            case 36:
                squares_affected.push(6)
                squares_affected.push(10)
                break
            
        }
    }
    console.log("squares_affected" + squares_affected)

    for(var i=0; i<players.length; i++) {
        if (squares_affected.indexOf(players[i]["square"]) != -1) {
            players[i]["alive"] = false
            players[i]["state"] = 3
            console.log("hit")

        }

    }

    var payload = {};
    payload["players"] = players
    payload["monsters"] = monsters
    payload["traps"] = squares_affected
    payload["status"] = "newTurn"
//    payload["items"] = items;
//console.log(payload)
    for (user in users) {
  //      console.log(i)
        
        try {
            if (users[user]["active"]) {
                users[user]["ws"].send(JSON.stringify(payload));
            }
        }
        catch (e) {
            console.log("Woops1, error: " + e + users[user]["id"]);
            users[user]["active"] = false
        }

    }
 //   console.log("sending")
}
setInterval(process_and_send_events, 50);
    
