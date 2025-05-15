const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
let usersOnline = 0;

class MazeBlock{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    display(){
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

let mazeBlocks = [new MazeBlock(0, 0, 200, 200), new MazeBlock(0, 0, 200, 200), new MazeBlock(0, 0, 200, 200), new MazeBlock(0, 0, 200, 200)];

let players = {};
let playersBullets = {};
let bulletArray = []
const canvas = {
    width: 2400,
    height: 1400,
};

mazeBlocks.forEach(block => {
    block.x = Math.random() * canvas.width;
    block.y = Math.random() * canvas.height;
})
app.get('/domination.js', (req, res) => {
    res.sendFile(__dirname + '/domination.js');
})
app.get('/domination', (req, res) => {
    res.sendFile(__dirname + '/domination.html');
})
app.get('/journey', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/lobby.js', (req, res) => {
    res.sendFile(__dirname + '/lobby.js');
})
app.get('/FFA', (req, res) => res.sendFile(__dirname + '/FFA.html'));
app.get('/FFA.js', (req, res) => {
    res.sendFile(__dirname + '/FFA.js');
})

app.get('/eventListeners.js', (req, res) => {
    res.sendFile(__dirname + '/eventListeners.js');
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/lobby.html');
});
app.get('/index.js', (req, res) => {
    res.sendFile(__dirname + '/index.js');
})
app.get('/mechanics.js', (req, res) => {
    res.sendFile(__dirname + '/mechanics.js');
})
app.get('/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/socket.io.js');
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        usersOnline--;
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
    socket.emit("S2C-MazeBlocks", mazeBlocks);
    usersOnline++;
    socket.emit("updateOnlineUsers", usersOnline);
});

server.listen(3000, () => {
    console.log('listening on http://localhost:3000');
});
