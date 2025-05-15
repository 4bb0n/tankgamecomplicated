/*
Please note that some of the code is AI generated.
Though of course, most of the code is written by me.

Code generated or edited by AI wil have A LOT of comments.

Some other code are edited by AI or just simply AI's Idea or solution that is written by me.

I use codeium to make coding process easier and quicker. I also use Prettier to make my code look better.

Author: 4bb0n / Abbon

AIs used:
Codeium - Code completion. basically make your code quicker to write. Definitely recommend this aftre Github Copilot.
ChatGPT 4o - backup for 3o
ChatGPT 3o mini - shootBullet() function, bullet positioning, inspire fix ideas.
DeepSeek R1
DeepSeek V3 - very good, but sometimes forgetful.
Gemini 2.5 Pro - made grid.

Shoutout to especially ChatGPT 3o mini, DeepSeek V3(version 3024) and Gemini 2.5 Pro - Got most of the prompts in one shot.
*/


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const socket = io()
let offsetx = 0;
let offsety = 0;
const gridSize = 30;
const gridColor = '#d3d3d3';
let friction = 0.9;

class Tank {
  constructor(
    x,
    y,
    width,
    height,
    angle,
    health,
    bodyDamage,
    bulletSpeed,
    bulletPenetration,
    movementSpeed,
    regeneration,
    colour,
    id,
    immune,
    maxHealth
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.speed = movementSpeed;
    this.regeneration = regeneration;
    this.bodyDamage = bodyDamage;
    this.bulletSpeed = bulletSpeed;
    this.bulletPenetration = bulletPenetration;
    this.colour = colour;
    this.health = health;
    this.maxHealth = maxHealth;
    this.diameter = 30;
    this.id = id;
    this.mapPosition = { x: canvas.width / 2, y: canvas.height / 2 };
    this.immune = immune;
  }

  updateAngle(mouseX, mouseY) {
    const dx = mouseX - canvas.width / 2; // Use tank's center (not x + width / 2)
    const dy = mouseY - canvas.height / 2;
    this.angle = Math.atan2(dy, dx);
  }

  move() {
      if (keys.has("ArrowUp") || keys.has("w")) {
        this.y -= this.speed;
        enemies.forEach((enemy) => {
          enemy.y += this.speed;
        });
        this.mapPosition.y = this.y;
        bullets.forEach((bullet) => {
          bullet.y += this.speed;
        });
        mazeBlocks.forEach((block) => {
          block.y += this.speed;
        });
        immune = false;
        offsety += this.speed;
        bosses.forEach((boss) => {
          boss.y += this.speed;
        })
        bossBullets.forEach((bullet) => {
          bullet.y += this.speed;
        });
        dominators.forEach(dominator => {
            dominator.y += this.speed
        });
        dominatorBullets.forEach((bullet) => {
          bullet.y += this.speed;
        });
      }
      if (keys.has("ArrowDown") || keys.has("s")) {
        this.y += this.speed;
        enemies.forEach((enemy) => {
          enemy.y -= this.speed;
        });
        this.mapPosition.y = this.y;
        bullets.forEach((bullet) => {
          bullet.y -= this.speed;
        });
        mazeBlocks.forEach((block) => {
          block.y -= this.speed;
        });
        immune = false;
        offsety -= this.speed;
        bosses.forEach((boss) => {
          boss.y -= this.speed;
        })
        bossBullets.forEach((bullet) => {
          bullet.y -= this.speed;
        });
        dominators.forEach(dominator => {
            dominator.y -= this.speed
        });
        dominatorBullets.forEach((bullet) => {
          bullet.y -= this.speed;
        });
      }
      if (keys.has("ArrowLeft") || keys.has("a")) {
        this.x -= this.speed;
        enemies.forEach((enemy) => {
          enemy.x += this.speed;
        });
        this.mapPosition.x = this.x;
        bullets.forEach((bullet) => {
          bullet.x += this.speed;
        });
        mazeBlocks.forEach((block) => {
          block.x += this.speed;
        });
        immune = false;
        offsetx += this.speed;
        bosses.forEach((boss) => {
          boss.x += this.speed;
        })
        bossBullets.forEach((bullet) => {
          bullet.x += this.speed;
        });
        dominators.forEach(dominator => {
            dominator.x += this.speed
        })
        dominatorBullets.forEach((bullet) => {
          bullet.x += this.speed;
        });
      }
      if (keys.has("ArrowRight") || keys.has("d")) {
        this.x += this.speed;
        enemies.forEach((enemy) => {
          enemy.x -= this.speed;
        });
        this.mapPosition.x = this.x;
        bullets.forEach((bullet) => {
          bullet.x -= this.speed;
        });
        mazeBlocks.forEach((block) => {
          block.x -= this.speed;
        });
        immune = false;
        offsetx -= this.speed;
        bosses.forEach((boss) => {
          boss.x -= this.speed;
        })
        bossBullets.forEach((bullet) => {
          bullet.x -= this.speed;
        });
        dominators.forEach(dominator => {
            dominator.x -= this.speed
        })
        dominatorBullets.forEach((bullet) => {
          bullet.x -= this.speed;
        });
      }
    if (keys.has(" ") && reloaded) {
      shootBullet();
      reloaded = false;
    }
  }

  display() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.colour;
    
    // Draw tank body (circle)
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, this.diameter, 0, 2 * Math.PI);
    ctx.fill();
    
    // Save state and move origin to tank center (for nozzle rotation)
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(this.angle);

    // Draw the nozzle (still rotates with tank)
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(this.diameter - 5, -10, 30, 25);
    
    ctx.restore();

    // Draw health bar (fixed at bottom, not rotating)
    const healthBarWidth = 80;
    const healthBarHeight = 5;
    const healthBarX = canvas.width / 2 - healthBarWidth / 2; // Center horizontally
    const healthBarY = canvas.height / 2 + this.diameter + 5; // Position below tank

    ctx.fillStyle = 'red';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    ctx.fillStyle = 'green';
    ctx.fillRect(healthBarX, healthBarY, (healthBarWidth * this.health) / this.maxHealth, healthBarHeight);
}
}

class Enemy {
  constructor(
    x,
    y,
    width,
    height,
    angle,
    health,
    bodyDamage,
    bulletSpeed,
    bulletPenetration,
    movementSpeed,
    regeneration,
    colour,
    id,
    mapPosition,
    immune
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.speed = movementSpeed;
    this.regeneration = regeneration;
    this.bodyDamage = bodyDamage;
    this.bulletSpeed = bulletSpeed;
    this.bulletPenetration = bulletPenetration;
    this.colour = "#a5eb67";
    this.health = health;
    this.diameter = 35;
    this.id = id;
    this.mapPosition = mapPosition;
    this.immune = immune;
  }

  display() {
    ctx.globalAlpha = 1;
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
    const healthBarWidth = 80;
    const healthBarHeight = 5;
    const healthBarX = canvas.width / 2 - healthBarWidth / 2; // Center horizontally
    const healthBarY = canvas.height / 2 + this.diameter + 5; // Position below tank

    ctx.fillStyle = 'red';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    ctx.fillStyle = 'green';
    ctx.fillRect(healthBarX, healthBarY, (healthBarWidth * this.health) / this.maxHealth, healthBarHeight);

    // Draw the nozzle correctly relative to the tank's center
    ctx.fillStyle = "lightgray";
    ctx.fillRect(this.diameter - 5, -10, 30, 25); // Adjusted position

    ctx.restore();
  }
}

class Bullet {
  constructor(x, y, angle, owner, speed) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.radius = 12.5;
    this.id = owner;
    this.diameter = 25;
    this.colour = "#1db4de";
    this.penetration = 0;
    this.startX = x;
    this.startY = y;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  display() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
class Map {
  constructor(x, y, width, height, playerPosition, enemies, mazeBlocks) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.playerPosition = playerPosition;
    this.enemies = enemies;
    this.mazeBlocks = mazeBlocks;
  }
  display() {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "lightgray";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.rect(this.x, this.y, this.width, this.height);

    ctx.globalAlpha = 1;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(
      this.playerPosition.x / 10 + this.x + 100,
      this.playerPosition.y / 10 + this.y + 100,
      5,
      0,
      2 * Math.PI
    );
    ctx.fill();

    this.enemies.forEach((enemy) => {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(
        enemy.mapPosition.x / 10 + this.x + 100,
        enemy.mapPosition.y / 10 + this.y + 100,
        5,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });

    this.mazeBlocks.forEach((block) => {
      block.display();
    });
  }
}

class MazeBlock {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  display() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "gray";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
class Boss {
  constructor(
    x,
    y,
    width,
    height,
    angle,
    health,
    bodyDamage,
    bulletSpeed,
    bulletPenetration,
    movementSpeed,
    regeneration,
    colour,
    id,
    mapPosition
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.speed = movementSpeed;
    this.regeneration = regeneration;
    this.bodyDamage = bodyDamage;
    this.bulletSpeed = bulletSpeed;
    this.bulletPenetration = bulletPenetration;
    this.colour = colour;
    this.health = health;
    this.diameter = 40;
    this.id = id;
    this.mapPosition = mapPosition;
    this.control = "AUTO";
  }
  updateAngle(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    this.angle = Math.atan2(dy, dx);
  }
  display() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.colour;

    // Draw boss body (circle)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.diameter, 0, 2 * Math.PI);
    ctx.fill();

    // Save state and move origin to boss center
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Draw the nozzle correctly relative to the boss's center
    ctx.fillStyle = "lightgray";
    ctx.fillRect(this.diameter - 5, -10, 30, 20); // Adjusted position

    ctx.restore();

    const healthBarWidth = 80;
    const healthBarHeight = 5;
    const healthBarX = this.x - healthBarWidth / 2; // Center horizontally
    const healthBarY = this.y + this.diameter + 5; // Position below tank

    ctx.fillStyle = 'red';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    ctx.fillStyle = 'green';
    ctx.fillRect(healthBarX, healthBarY, (healthBarWidth * this.health) / 135, healthBarHeight);
  }
}

let mapCanvas = {
  width: 2400,
  height: 1400,
};
let mapPosition = {
  x: mapCanvas.width / 2,
  y: mapCanvas.height / 2,
};
class Dominator {
  constructor(
    x,
    y,
    width,
    height,
    angle,
    health,
    bodyDamage,
    bulletSpeed,
    bulletPenetration,
    movementSpeed,
    regeneration,
    colour,
    id,
    mapPosition
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.speed = movementSpeed;
    this.regeneration = regeneration;
    this.bodyDamage = bodyDamage;
    this.bulletSpeed = bulletSpeed;
    this.bulletPenetration = bulletPenetration;
    this.colour = colour;
    this.health = health;
    this.diameter = 60;
    this.id = id;
    this.mapPosition = mapPosition;
  }

  updateAngle(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    this.angle = Math.atan2(dy, dx);
  }
  display() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.colour;

    // Draw boss body (circle)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.diameter, 0, 2 * Math.PI);
    ctx.fill();

    // Save state and move origin to boss center
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Draw the nozzle correctly relative to the boss's center
    ctx.fillStyle = "lightgray";
    ctx.fillRect(this.diameter - 5, -10, 30, 20); // Adjusted position

    ctx.restore();

    const healthBarWidth = 80;
    const healthBarHeight = 5;
    const healthBarX = this.x - healthBarWidth / 2; // Center horizontally
    const healthBarY = this.y + this.diameter + 5; // Position below tank

    ctx.fillStyle = 'red';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    ctx.fillStyle = 'green';
    ctx.fillRect(healthBarX, healthBarY, (healthBarWidth * this.health) / 135, healthBarHeight);
  }
}
class BulletForEnemies {
  constructor(x, y, angle, owner, speed) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.radius = 10;
    this.id = owner;
    this.diameter = 20;
    this.colour = "red";
    this.penetration = 0;
  }
}
let bossDamage = 30;
let movementSpeed = 2;
let bulletSpeed = 3;
let dominatorBulletSpeed = 7;
let dominatorMovementSpeed = 1;
let bossBulletSpeed = 25;
let enemies = [];
let mazeBlocks = [];
let immune = true;
let maxHealth = 140;
let velocity = 0;
let tank = new Tank(
  canvas.width / 2,
  canvas.height / 2,
  50,
  50,
  0,
  140,
  2,
  bulletSpeed,
  0,
  movementSpeed,
  0,
  "#1db4de",
  socket.id,
  immune,
  maxHealth
);
let map = new Map(
  canvas.width - 480,
  canvas.height - 280,
  480,
  280,
  tank.mapPosition,
  enemies,
  mazeBlocks
);
let bullets = [];
let bossBullets = [];
const keys = new Set(); // Store pressed keys
let reloadSpeed = 400;
let bodyDamage = 0;
let reloaded = true;
let receivedBullets = [];
let upgradesLeft = 42;
let bulletsForEnemies = [];
let dominatorBullets = [];
let dominatorDamage = 20;

canvas.onclick = () => {
  if (reloaded) {
    shootBullet();
    reloaded = false;
  }
};
socket.on("S2C-MazeBlocks", (data) => {
  mazeBlocks = [];
  data.forEach((block) => {
    mazeBlocks.push(new MazeBlock(block.x, block.y, block.width, block.height));
  });
});

socket.on("enemyDied", (id) => {
  enemies.forEach((enemy) => {
    if (enemy.id == id) {
      enemy.mapPosition.y = 100000;
      enemy.mapPosition.x = 100000;
      enemies.splice(enemies.indexOf(enemy), 1);
      console.log("received");
    }
  });
});

socket.on(
  "removeBulletAndChangePenetration",
  (firstBullet, secondIndex, secondBullet) => {
    if (firstBullet.id !== socket.id) {
      receivedBullets.forEach((bullet) => {
        if (bullet.id == firstBullet.id) {
          receivedBullets.splice(receivedBullets.indexOf(bullet), 1);
          bullets[secondIndex].penetration = secondBullet;
        }
      });
    }
    if (secondBullet.id == socket.id) {
      bullets.splice(secondIndex, 1);
    }
  }
);

socket.on("removeBullet", (index, id) => {
  if (id == socket.id) {
    bullets.splice(index, 1);
  }
});

socket.on("returnEnemies", (data) => {
  enemies = [];
  data.forEach((enemy) => {
    const screenX = enemy.mapPosition.x - tank.x + canvas.width / 2;
    const screenY = enemy.mapPosition.y - tank.y + canvas.height / 2;
    enemies.push(
      new Enemy(
        screenX,
        screenY,
        enemy.width,
        enemy.height,
        enemy.angle,
        enemy.health,
        enemy.bodyDamage,
        enemy.bulletSpeed,
        enemy.bulletPenetration,
        enemy.movementSpeed,
        enemy.regeneration,
        enemy.colour,
        enemy.id,
        enemy.mapPosition,
        enemy.immune
      )
    );
  });
});

socket.on("hitSuccess", (index) => {
  bullets.splice(index, 1);
  bulletsForEnemies.splice(index, 1);
  console.log("hit");
});

socket.on("hitBullet", (id, bullet, damage) => {
  receivedBullets.forEach((bullet, index) => {
    receivedBullets.splice(index, 1);
  });
  tank.health -= damage;
  if (tank.health <= 0) {
    socket.emit("died", tank.id);
    tank.y = 100000;
    tank.x = 100000;
  }
});

socket.on("bulletInfo", (data) => {
  receivedBullets = [];
  data.forEach((bullet) => {
    receivedBullets.push(
      new Bullet(
        bullet.x + offsetx,
        bullet.y + offsety,
        bullet.angle,
        bullet.id,
        bullet.speed
      )
    );
  });
  console.log(receivedBullets[0])
});
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
  enemy.colour = "lime";
});

function dominatorShootBullet(){
  dominators.forEach((dominator) => {
    const bulletX = dominator.x + Math.cos(dominator.angle) * (dominator.diameter);
    const bulletY = dominator.y + Math.sin(dominator.angle) * (dominator.diameter);
    dominatorBullets.push(
      new Bullet(bulletX, bulletY, dominator.angle, socket.id, dominator.bulletSpeed)
    );
  });
}

function bossShootBullet() {
  bosses.forEach((boss) => {
    const bulletX = boss.x + Math.cos(boss.angle) * (boss.diameter / 2);
    const bulletY = boss.y + Math.sin(boss.angle) * (boss.diameter / 2);
    bossBullets.push(
      new Bullet(bulletX, bulletY, boss.angle, socket.id, boss.bulletSpeed)
    );
  });
}

document.addEventListener("keydown", (event) => keys.add(event.key));
document.addEventListener("keyup", (event) => keys.delete(event.key));

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  tank.updateAngle(mouseX, mouseY);
});
function shootBullet() {
  immune = false;
  const nozzleLength = 30; // The length of the nozzle

  // Calculate the bullet's starting position at the end of the nozzle
  const bulletX =
    tank.mapPosition.x +
    Math.cos(tank.angle) * (tank.diameter / 2 + nozzleLength);
  const bulletY =
    tank.mapPosition.y +
    Math.sin(tank.angle) * (tank.diameter / 2 + nozzleLength);
  bulletsForEnemies.push(
    new Bullet(bulletX, bulletY, tank.angle, socket.id, bulletSpeed)
  );

  const bulletX2 =
    canvas.width / 2 +
    Math.cos(tank.angle) * (tank.diameter / 2 + nozzleLength);
  const bulletY2 =
    canvas.height / 2 +
    Math.sin(tank.angle) * (tank.diameter / 2 + nozzleLength);
  bullets.push(
    new Bullet(bulletX2, bulletY2, tank.angle, socket.id, bulletSpeed)
  );
}

function drawGrid() {
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1; // Thin lines
    ctx.globalAlpha = 0.4; // Make grid slightly transparent so it's not too distracting

    // Calculate the starting drawing points based on the offset
    // The modulo (%) operator ensures the grid lines wrap around correctly
    // as the offset increases or decreases.
    const startX = offsetx % gridSize;
    const startY = offsety % gridSize;

    // Draw vertical lines
    // We start drawing from potentially off-screen left (startX - gridSize)
    // and go past the right edge (canvas.width + gridSize) to ensure coverage
    // even when the offset causes partial squares at the edges.
    for (let x = startX - gridSize; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal lines
    // Similar logic for horizontal lines, starting potentially above the screen.
    for (let y = startY - gridSize; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Reset alpha if you changed it
    ctx.globalAlpha = 1.0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  tank.move();
  tank.display();

  bullets.forEach((bullet, index) => {
    bullet.update();
    bullet.display();

    // Compute distance traveled from its firing origin
    const dx = bullet.x - bullet.startX;
    const dy = bullet.y - bullet.startY;
    const traveled = Math.sqrt(dx * dx + dy * dy);

    if (traveled > 800) {
        bullets.splice(index, 1);
    }
});
bulletsForEnemies.forEach((bullet) => {
    bullet.update()
})

  enemies.forEach((enemy) => {
    enemy.display();
  });
  receivedBullets.forEach((bullet) => {
    bullet.display();
  });
  bossBullets.forEach((bullet, index) => {
    bullet.update(); // Add this line to update bullet positions
    bullet.display();

    // Add boundary check to remove bullets that go off-screen
    if (
      bullet.x < 0 ||
      bullet.x > canvas.width ||
      bullet.y < 0 ||
      bullet.y > canvas.height
    ) {
      bossBullets.splice(index, 1);
    }
  });
  map.display();
  mazeBlocks.forEach((block) => {
    block.display();
  });
  bosses.forEach((boss) => {
    boss.display();
  });
  dominators.forEach((dominator) => {
    dominator.display();
  });
  dominatorBullets.forEach((bullet, index) => {
    bullet.update();
    bullet.display();
    if (
      bullet.x < 0 ||
      bullet.x > canvas.width ||
      bullet.y < 0 ||
      bullet.y > canvas.height
    ) {
      dominatorBullets.splice(index, 1);
    }
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
      if (H < enemy.diameter + bullet.radius && enemy.immune == false) {
        enemy.health -= damage;
        if (enemy.health <= 0) {
          enemies.splice(enemies.indexOf(enemy), 1);
          socket.emit("killEnemy");
        }
        enemy.colour = "#a4ebbe";
        setTimeout(() => {
          enemy.colour = "lime";
        }, 100);
        socket.emit("hitBullet", bullet.id, index, bullet, damage);
      }
    });
    if (enemy.health <= 0) {
      enemy.y = 100000;
      enemy.y = 100000;
    }
  });
  bullets.forEach((bullet, index) => {
    receivedBullets.forEach((recBullet) => {
      let A = Math.abs(bullet.x - recBullet.x);
      let O = Math.abs(bullet.y - recBullet.y);
      let H = Math.sqrt(A * A + O * O);
      if (
        H < recBullet.diameter + bullet.radius &&
        bullet.penetration > recBullet.penetration
      ) {
        bullet.penetration -= recBullet.penetration;
        receivedBullets.splice(receivedBullets.indexOf(recBullet), 1);
        socket.emit(
          "removeBullet",
          receivedBullets.indexOf(recBullet),
          recBullet.id
        );
      } else if (
        H < recBullet.diameter + bullet.radius &&
        bullet.penetration === recBullet.penetration
      ) {
        bullets.splice(index, 1);
        receivedBullets.splice(receivedBullets.indexOf(recBullet), 1);
        socket.emit(
          "removeBullet",
          receivedBullets.indexOf(recBullet),
          recBullet.id
        );
      } else if (
        H < recBullet.diameter + bullet.radius &&
        bullet.penetration < recBullet.penetration
      ) {
        bullets.splice(index, 1);
        recBullet.penetration -= bullet.penetration;
        socket.emit(
          "removeBulletAndChangePenetration",
          index,
          bullet,
          receivedBullets.indexOf(recBullet),
          recBullet
        );
      }
    });
    bossBullets.forEach((bossBullet) => {
      let A = Math.abs(bullet.x - bossBullet.x);
      let O = Math.abs(bullet.y - bossBullet.y);
      let H = Math.sqrt(A * A + O * O);
      if (H < bossBullet.radius + bullet.radius) {
        bossBullets.splice(bossBullets.indexOf(bossBullet), 1);
        bullets.splice(index, 1);
      }
      bosses.forEach((boss) => {
        A = Math.abs(bullet.x - boss.x);
        O = Math.abs(bullet.y - boss.y);
        H = Math.sqrt(A * A + O * O);
        if (H < boss.diameter + bullet.radius) {
          boss.health -= damage;
          bullets.splice(index, 1);
          if (boss.health <= 0) {
            bosses.splice(bosses.indexOf(boss), 1);
          }
        }
      });
    });
  });
  bossBullets.forEach((bullet, index) => {
    if (
      bullet.x < -1200 ||
      bullet.x > 1200 ||
      bullet.y < -700 ||
      bullet.y > 700
    ) {
      bossBullets.splice(index, 1);
    }
    let A = Math.abs(bullet.x - tank.mapPosition.x - offsetx);
    let O = Math.abs(bullet.y - tank.mapPosition.y - offsety);
    let H = Math.sqrt(A * A + O * O);
    if (H < tank.diameter + bullet.radius && tank.immune == false) {
      bossBullets.splice(index, 1);
      tank.health -= bossDamage;
      if (tank.health <= 0) {
        tank.mapPosition.x = 100000;
        tank.mapPosition.y = 100000;
        clearInterval(tickInterval);
        tank = undefined;
      }
      tank.colour = "#a4ebbe";
      setTimeout(() => {
        tank.colour = "lime";
      }, 100);
    }
  });
  dominatorBullets.forEach((bullet, index) => {
    let A = Math.abs(bullet.x - tank.mapPosition.x - offsetx);
    let O = Math.abs(bullet.y - tank.mapPosition.y - offsety);
    let H = Math.sqrt(A * A + O * O);
    if (H < tank.diameter + bullet.radius && tank.immune == false) {
      dominatorBullets.splice(index, 1);
      tank.health -= dominatorDamage;
      if (tank.health <= 0) {
        tank.mapPosition.x = 100000;
        tank.mapPosition.y = 100000;
        clearInterval(tickInterval);
        tank = undefined;
      }
      tank.colour = "#a4ebbe";
      setTimeout(() => {
        tank.colour = "lime";
      }, 100);
    }
    bullets.forEach((bullet2) => {
        A = Math.abs(bullet.x - bullet2.x);
        O = Math.abs(bullet.y - bullet2.y);
        H = Math.sqrt(A * A + O * O);
        if (H < bullet2.diameter + bullet.radius) {
            dominatorBullets.splice(index, 1);
            bullets.splice(bullets.indexOf(bullet2), 1);
        }
    })
  })
  bosses.forEach((boss) => {
        boss.updateAngle(tank.x + offsetx, tank.y + offsety);
  });
  dominators.forEach(dominator => {
      dominator.updateAngle(tank.x + offsetx, tank.y + offsety);
      let A = Math.abs(dominator.x - tank.mapPosition.x - offsetx);
      let O = Math.abs(dominator.y - tank.mapPosition.y - offsety);
      let H = Math.sqrt(A * A + O * O);
      if(H > 200){
      const Y = (Math.sin(dominator.angle) * dominator.speed);
      const X = (Math.cos(dominator.angle) * dominator.speed);
      dominator.x += X;
      dominator.y += Y;
      }
      else if(H < 200){
        const X = -(Math.cos(dominator.angle) * dominator.speed);
        const Y = -(Math.sin(dominator.angle) * dominator.speed);
        dominator.x += X / 2;
        dominator.y += Y / 2;
      }
      bullets.forEach((bullet) => {
        let A = Math.abs(bullet.x - dominator.x);
        let O = Math.abs(bullet.y - dominator.y);
        let H = Math.sqrt(A * A + O * O);
        if (H < dominator.diameter + bullet.radius) {
          dominator.health -= damage;
          bullets.splice(bullets.indexOf(bullet), 1);
          if (dominator.health <= 0) {
            dominators.splice(dominators.indexOf(dominator), 1);
          }
        }
      })
  })

  if (tank.health <= 0) {
    tank.mapPosition.x = 100000;
    tank.mapPosition.y = 100000;
    clearInterval(tickInterval);
    tank = undefined;
  }
  map.playerPosition = tank.mapPosition;
  map.enemies = enemies;
  tank.immune = immune;
  socket.emit("tankInfo", tank);
  socket.emit("bulletInfo", bulletsForEnemies);
  socket.emit("getEnemies");
}
let tickInterval = setInterval(tick, 10);
let bulletInterval = setInterval(() => {
  reloaded = true;
}, reloadSpeed);
let regenerationInterval = setInterval(() => {
  if (tank.health < tank.maxHealth && tank.regeneration > 0) {
    tank.health += 15;
  }
}, 9500 - tank.regeneration * 1000);
let bossBulletInterval = setInterval(() => {
  bossShootBullet();
}, 100);
let dominatorBulletInterval = setInterval(() => {
  dominatorShootBullet();
}, 400)
let immuneInterval = setInterval(() => {
    if(immune){
        tank.colour = "#31c8f2"
        setTimeout(() => {
            tank.colour = "#1db4de"
        }, 100);
    }
    }, 300)

