const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

let players = {};
let playersBullets = {};
let bulletArray = []
const canvas = {
    width: 2400,
    height: 1400,
};

app.get('/eventListeners.js', (req, res) => {
    res.sendFile(__dirname + '/eventListeners.js');
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/index.js', (req, res) => {
    res.sendFile(__dirname + '/index.js');
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete players[socket.id];
    });

    socket.on("tankInfo", (data) => {
        players[socket.id] = data;
    })

    socket.on('getEnemies', () => {
        let players2 = []
        for(let key in players){
            if(key !== socket.id){
                players2.push(players[key]);
            }
        }
        socket.emit("returnEnemies", players2);
    });
    socket.on("bulletInfo", (data) => {
        playersBullets[socket.id] = data;
        socket.broadcast.emit("bulletInfo", data);
    });
    socket.on("hitBullet", (id, index, bullet, damage) => {
        socket.broadcast.emit("hitBullet", id, bullet, damage);
        socket.emit("hitSuccess");
    })
    socket.on("removeBullet", (index, id) => {
        socket.broadcast.emit("removeBullet", index, id)
    })
    socket.on("removeBulletAndChangePenetration", (firstBullet, secondIndex, secondBullet) => {
        socket.broadcast.emit("removeBulletAndChangePenetration", firstBullet, secondIndex, secondBullet)
    })
    socket.on("bodyDmg", (firstPlayerId, firstHealth, secondPlayerId, secondHealth) => {
        socket.emit("bodyDmg", firstPlayerId, firstHealth, secondPlayerId, secondHealth)
    })
    socket.on("died", (id) => {
        socket.broadcast.emit("enemyDied", id)
    })
});

server.listen(3000, () => {
    console.log('listening on http://localhost:3000');
});
