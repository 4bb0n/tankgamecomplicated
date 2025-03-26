
document.getElementById("healthBoost").addEventListener("click", () => {
    const healthBoost = document.getElementById("healthBoost");
    
    if(healthBoost.value < healthBoost.max){
    tank.health += 15;
    document.getElementById("healthBoost").value += 1;
    upgradesLeft -= 1
    }
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
})
document.getElementById("reload").addEventListener("click", () => {
    clearInterval(bulletInterval);
    if(document.getElementById("reload").value < document.getElementById("reload").max){
    reloadSpeed -= 10;
    document.getElementById("reload").value += 1;
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
    bulletInterval = setInterval(() => {
        reloaded = true;
    }, reloadSpeed);
})
document.getElementById("bulletDamage").addEventListener("click", () => {
    const bulletDamage = document.getElementById("bulletDamage");
    if(bulletDamage.value < bulletDamage.max){
    document.getElementById("bulletDamage").value += 1;
    damage += 1
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
})

document.getElementById("bodyDamage").addEventListener("click", () => {
    const bodyDamage = document.getElementById("bodyDamage");
    if(bodyDamage.value < bodyDamage.max){
    document.getElementById("bodyDamage").value += 1;
    tank.bodyDamageValue += 1
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
})

document.getElementById("bulletPenetration").addEventListener("click", () => {
    const bulletPenetration = document.getElementById("bulletPenetration");
    if(bulletPenetration.value < bulletPenetration.max){
    document.getElementById("bulletPenetration").value += 1;
    tank.penetration += 1
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
})

document.getElementById("bulletSpeed").addEventListener("click", () => {
    const bulletSpeed2 = document.getElementById("bulletSpeed");
    if(bulletSpeed2.value < bulletSpeed2.max){
    document.getElementById("bulletSpeed").value += 1;
    bulletSpeed += 1
    upgradesLeft -= 1
    document.getElementById("upgradesLeft").innerHTML = upgradesLeft;
    }
})
