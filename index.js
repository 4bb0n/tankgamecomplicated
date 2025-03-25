const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const socket = io();

class Tank {
    constructor(x, y, width, height, angle, health, bodyDamage, bulletSpeed, bulletPenetration, movementSpeed, regeneration, colour, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.speed = movementSpeed;
        this.regeneration = regeneration
        this.bodyDamage = bodyDamage;
        this.bulletSpeed = bulletSpeed;
        this.bulletPenetration = bulletPenetration;
        this.colour = colour
        this.health = health;
        this.diameter = 30;
        this.id = id
    }

    updateAngle(mouseX, mouseY) {
        const dx = mouseX - this.x;  // Use tank's center (not x + width / 2)
        const dy = mouseY - this.y;
        this.angle = Math.atan2(dy, dx);
    }
    

    move() {
        if (keys.has("ArrowUp")) this.y -= this.speed;
        if (keys.has("ArrowDown")) this.y += this.speed;
        if (keys.has("ArrowLeft")) this.x -= this.speed;
        if (keys.has("ArrowRight")) this.x += this.speed;
        if (keys.has(" ") && reloaded){
            shootBullet();
            reloaded = false;
        }
    }

    display() {
        ctx.fillStyle = this.colour;
        
        // Draw tank body (circle)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.diameter, 0, 2 * Math.PI);
        ctx.fill();
    
        // Save state and move origin to tank center
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Make health bar
        ctx.fillStyle = 'red'
        ctx.fillRect(-this.diameter / 2, -this.diameter / 2 - 10, 80, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(-this.diameter / 2, -this.diameter / 2 - 10, this.health * 2, 5);
    
        // Draw the nozzle correctly relative to the tank's center
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(this.diameter - 5, -5, 30, 10); // Adjusted position
    
        ctx.restore();
    }
}

let tank = new Tank(100, 100, 50, 50, 0, 40, 2, 1, 0, 2, 0, '#1db4de', socket.id);
let enemies = [];
let bullets = [];
const keys = new Set(); // Store pressed keys
let reloadSpeed = 400;
let bodyDamage = 0;
let reloaded = true;
let receivedBullets = []
let upgradesLeft = 42;
/*
socket.on("bodyDmg", (firstPlayerId, firstHealth, secondPlayerId, secondHealth) => {
    if(secondPlayerId == socket.id){
        tank.health = secondHealth;
    }
    enemies.forEach(enemy => {
        if(enemy.id == firstPlayerId){
            enemy.health = firstHealth;
        }
    })
})
*/

socket.on("removeBulletAndChangePenetration", (firstBullet, secondIndex, secondBullet) => {
    if(firstBullet.id !== socket.id){
        receivedBullets.forEach((bullet) => {
            if(bullet.id == firstBullet.id){
                receivedBullets.splice(receivedBullets.indexOf(bullet), 1);
                bullets[secondIndex].penetration = secondBullet;
            }
        })
    }
    if(secondBullet.id == socket.id){
        bullets.splice(secondIndex, 1);
    }
})

socket.on("removeBullet", (index, id) => {
    if(id == socket.id){
    bullets.splice(index, 1);
    }
})

socket.on("returnEnemies", (data) => {
    enemies = [];
    data.forEach(enemy => {
    enemies.push(new Tank(enemy.x, enemy.y, enemy.width, enemy.height, enemy.angle, enemy.health, enemy.bodyDamage, enemy.bulletSpeed, enemy.bulletPenetration, enemy.movementSpeed, enemy.regeneration, enemy.colour, enemy.id));
    })
})

socket.on("hitSuccess", (index) => {
    bullets.splice(index, 1);
    console.log("hit");
})

socket.on("hitBullet", (id, index, damage) => {
    receivedBullets.splice(index, 1);
    tank.health -= damage;
    if(tank.health <= 0){
        socket.emit("died", tank.id);
        tank.y = 100000;
        tank.x = 100000;
    }
})

socket.on("bulletInfo", (data) => {
    receivedBullets = [];
    data.forEach((bullet) => {
        bullet.colour = 'red'
        receivedBullets.push(new Bullet(bullet.x, bullet.y, bullet.angle, bullet.id));
    })
})
/*
socket.on("returnEnemies", (data) => {
    // Create a set of enemy IDs that are in the new data
    let newIDs = new Set();
  
    // Iterate through incoming enemy data
    for (let key in data) {
        let enemyData = data[key];
        if (enemyData.id === socket.id) continue; // Skip yourself
        newIDs.add(enemyData.id);
      
        // Find existing enemy
        let existingEnemy = enemies.find(e => e.id === enemyData.id);
        if (existingEnemy) {
            // Update the enemy's properties in place
            existingEnemy.x = enemyData.x;
            existingEnemy.y = enemyData.y;
            existingEnemy.angle = enemyData.angle;
            existingEnemy.health = enemyData.health;
            existingEnemy.colour = enemyData.colour;
        } else {
            // Add new enemy if it doesn't exist
            enemies.push(new Tank(
                enemyData.x, enemyData.y, enemyData.width, enemyData.height, 
                enemyData.angle, enemyData.health, enemyData.colour, enemyData.id
            ));
        }
    }
  
    // Remove any enemy that is not present in the latest data
    enemies = enemies.filter(e => newIDs.has(e.id));
});
*/


enemies.forEach((enemy) => {
    enemy.colour = 'lime'
})

document.addEventListener('keydown', (event) => keys.add(event.key));
document.addEventListener('keyup', (event) => keys.delete(event.key));

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    tank.updateAngle(mouseX, mouseY);
});

function shootBullet() {
    const nozzleLength = 30; // The length of the nozzle

    // Calculate the bullet's starting position at the end of the nozzle
    const bulletX = tank.x + Math.cos(tank.angle) * (tank.diameter / 2 + nozzleLength - 15);
    const bulletY = tank.y + Math.sin(tank.angle) * (tank.diameter / 2 + nozzleLength - 15);
    

    bullets.push(new Bullet(bulletX, bulletY, tank.angle));
}

class Bullet {
    constructor(x, y, angle, owner) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 5;
        this.radius = 10;
        this.id = owner
        this.diameter = 20;
        this.colour = '#1db4de'
        this.penetration = 0;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    display() {
        ctx.fillStyle = this.colour;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tank.move();
    tank.display();

    bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.display();
        
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });

    enemies.forEach((enemy) => {
        enemy.display();
    });
    receivedBullets.forEach((bullet) => {
        bullet.display();
    });

    requestAnimationFrame(draw);
}

draw();
let damage = 1;
function tick() {
    enemies.forEach((enemy) => {
        bullets.forEach((bullet, index) => {
            let A = Math.abs(bullet.x - enemy.x); // a              a squared + b squared = c squared. square root of c squared gets you c
            let O = Math.abs(bullet.y - enemy.y); // b
            let H = Math.sqrt(A * A + O * O); // c
            if (H < enemy.diameter + bullet.radius) {
                enemy.health -= damage;
                if (enemy.health <= 0) {
                    enemies.splice(enemies.indexOf(enemy), 1);
                    socket.emit("killEnemy")
                }
                enemy.colour = '#a4ebbe'
                setTimeout(() => {
                    enemy.colour = 'lime'
                }, 100);
                socket.emit("hitBullet", bullet.id, index, damage);
            }
        })
        if(enemy.health <= 0){
            enemy.y = 100000
            enemy.y = 100000
        }
    })
    bullets.forEach((bullet, index) => {
        receivedBullets.forEach((recBullet) => {
            let A = Math.abs(bullet.x - recBullet.x);
            let O = Math.abs(bullet.y - recBullet.y)
            let H = Math.sqrt(A * A + O * O)
            if(H < recBullet.diameter + bullet.radius && bullet.penetration > recBullet.penetration){
                bullet.penetration -= recBullet.penetration;
                receivedBullets.splice(receivedBullets.indexOf(recBullet), 1)
                socket.emit("removeBullet", receivedBullets.indexOf(recBullet), recBullet.id)
            }
            else if(H < recBullet.diameter + bullet.radius && bullet.penetration === recBullet.penetration){
                bullets.splice(index, 1)
                receivedBullets.splice(receivedBullets.indexOf(recBullet), 1)
                socket.emit("removeBullet", receivedBullets.indexOf(recBullet), recBullet.id)
            }
            else if(H < recBullet.diameter + bullet.radius && bullet.penetration < recBullet.penetration){
                bullets.splice(index, 1)
                recBullet.penetration -= bullet.penetration;
                socket.emit("removeBulletAndChangePenetration", index, bullet, receivedBullets.indexOf(recBullet), recBullet)
            }
        })
    })
    /*
    enemies.forEach(enemy => {
        let A = Math.abs(tank.x - enemy.x);
        let O = Math.abs(tank.y - enemy.y)
        let H = Math.sqrt(A * A + O * O)
        if(H < enemy.diameter + tank.diameter){
            enemy.health -= tank.bodyDamage;
            tank.health -= enemy.bodyDamage;
            socket.emit("bodyDmg", tank.id, tank.health, enemy.id, enemy.health)
            console.log(enemy.health)
        }
    })
    */
    if(tank.health <= 0){
        tank.x = 100000
        tank.y = 100000
    }
        socket.emit("tankInfo", tank);
        socket.emit("bulletInfo", bullets)
        socket.emit("getEnemies");
}
let tickInterval = setInterval(tick, 25)
let bulletInterval = setInterval(() => {
    reloaded = true;
}, reloadSpeed);