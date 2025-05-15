
document.getElementById("healthBoost").addEventListener("click", () => {
    healthBoostFunction()
})
document.getElementById("reload").addEventListener("click", () => {
    reloadSpeedFunction()
})
document.getElementById("bulletDamage").addEventListener("click", () => {
    bulletDamageFunction()
})

document.getElementById("bodyDamage").addEventListener("click", () => {
    const bodyDamage = document.getElementById("bodyDamage");
    if(bodyDamage.value < bodyDamage.max && upgradesLeft > 0){
    document.getElementById("bodyDamage").value += 1;
    tank.bodyDamageValue += 1
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
})

document.getElementById("bulletPenetration").addEventListener("click", () => {
    bulletPenetrationFunction()
})

document.getElementById("bulletSpeed").addEventListener("click", () => {
    bulletSpeedFunction()
})
document.getElementById("movementSpeed").addEventListener("click", () => {
    movementSpeedFunction()
})

document.getElementById("regeneration").addEventListener("click", () => {
    regenerationFunction()
})
function healthBoostFunction() {
    const healthBoost = document.getElementById("healthBoost");
    
    if(healthBoost.value < healthBoost.max && upgradesLeft > 0){
    tank.health += 15;
    document.getElementById("healthBoost").value += 1;
    upgradesLeft -= 1
    maxHealth += 15;
    }
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
}
function bulletPenetrationFunction() {
    const bulletPenetration = document.getElementById("bulletPenetration");
    if(bulletPenetration.value < bulletPenetration.max && upgradesLeft > 0){
    document.getElementById("bulletPenetration").value += 1;
    tank.penetration += 1
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
}
function bulletSpeedFunction() {
    const bulletSpeed2 = document.getElementById("bulletSpeed");
    if(bulletSpeed2.value < bulletSpeed2.max && upgradesLeft > 0){
    document.getElementById("bulletSpeed").value += 1;
    bulletSpeed += 1
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
}
function bulletDamageFunction() {
    const bulletDamage = document.getElementById("bulletDamage");
    if(bulletDamage.value < bulletDamage.max && upgradesLeft > 0){
    document.getElementById("bulletDamage").value += 1;
    damage += 1
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
}
function reloadSpeedFunction() {
    const reloadSpeed2 = document.getElementById("reload");
    if(reloadSpeed2.value < reloadSpeed2.max && upgradesLeft > 0){
    reloadSpeed -= 10;
    document.getElementById("reload").value += 1;
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
    clearInterval(bulletInterval);
    bulletInterval = setInterval(() => {
        reloaded = true
    }, reloadSpeed)
}
function movementSpeedFunction(){
    const movementSpeed = document.getElementById("movementSpeed");
    if(movementSpeed.value < movementSpeed.max && upgradesLeft > 0){
    document.getElementById("movementSpeed").value += 1;
    tank.speed += 1
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
}
function regenerationFunction() {
    const regeneration = document.getElementById("regeneration");
    if(regeneration.value < regeneration.max && upgradesLeft > 0){
    document.getElementById("regeneration").value += 1;
    tank.regeneration += 1
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    clearInterval(regenerationInterval);
    regenerationInterval = setInterval(() => {
        if(tank.health < tank.maxHealth && tank.regeneration > 0){
        tank.health += 10
        }
    }, 9500 - tank.regeneration * 1000)
    }
}

//Quick upgrade keys

document.addEventListener("keydown", (e) => {
    if(e.key === "2") healthBoostFunction()
    if(e.key === "4") bulletPenetrationFunction()
    if(e.key === "3") bulletSpeedFunction()
    if(e.key === "6") bulletDamageFunction()
    if(e.key === "7") reloadSpeedFunction()
    if(e.key === "8") movementSpeedFunction()
    if(e.key === "9") regenerationFunction()
})
