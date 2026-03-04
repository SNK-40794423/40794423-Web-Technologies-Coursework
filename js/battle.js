
// Plain Stats


let playerHP = 100;
let enemyHP = 150;

let playerATK = 20;
let enemyATK = 15;

let playerTurn = true;
let battleStarted = false;



// D20 Rolls


function diceRoll() {
    return Math.floor(Math.random() * 20) + 1;
}

function checkDiceRoll(num) {

    if (num === 1) return "Bad";
    else if (num <= 5) return "Fine";
    else if (num <= 10) return "Ok";
    else if (num <= 16) return "Good";
    else if (num <= 19) return "High";
    else return "Critical"; // 20
}

// Dmg


function dealDamage(roll, atk, event) {

    if (event === "Bad") {
        return 0;
    }

    if (event === "Fine") {
        return atk + (roll - 6);
    }

    if (event === "Ok") {
        return atk + roll;
    }

    if (event === "Good") {
        return atk + roll + 5;
    }

    if (event === "High") {
        return atk + roll + 8;
    }

    return atk + roll + 12; // Critical
}



// UI Change


function updateHPDisplay() {
    document.getElementById("PlayerHP").innerHTML = "Player HP: " + playerHP;
    document.getElementById("EnemyHP").innerHTML = "Enemy HP: " + enemyHP;
}

// Battle


function startBattle() {

    if (!battleStarted) {
        battleStarted = true;
        document.getElementById("rollBtn").innerText = "Next Turn";
    }

    if (playerHP <= 0 || enemyHP <= 0) return;

    let roll = diceRoll();
    let event = checkDiceRoll(roll);
    let damage;

    document.getElementById("DiceRoll").innerHTML = "Roll: " + roll;
    document.getElementById("EventResult").innerHTML = "Result: " + event;

    let damageLine = document.getElementById("DealDamage");

if (playerTurn) {

    damage = dealDamage(roll, playerATK, event);
    enemyHP -= damage;

    damageLine.style.color = "blue";

    if (damage === 0) {
        damageLine.innerHTML = "Player missed!";
    }
    else if (event === "Critical") {
        damageLine.innerHTML =
            "Player dealt " + damage + " CRITICAL damage!";
    }
    else {
        damageLine.innerHTML =
            "Player dealt " + damage + " damage!";
    }

    playerTurn = false;

} else {

    damage = dealDamage(roll, enemyATK, event);
    playerHP -= damage;

    damageLine.style.color = "red";

    if (damage === 0) {
        damageLine.innerHTML = "Enemy missed!";
    }
    else if (event === "Critical") {
        damageLine.innerHTML =
            "Enemy dealt " + damage + " CRITICAL damage!";
    }
    else {
        damageLine.innerHTML =
            "Enemy dealt " + damage + " damage!";
    }

    playerTurn = true;
}
    // Prevent negative HP
    if (enemyHP < 0) enemyHP = 0;
    if (playerHP < 0) playerHP = 0;

    updateHPDisplay();
    checkBattleEnd();
}

// BATTLE END

function checkBattleEnd() {

    if (enemyHP <= 0) {
        document.getElementById("FinalResult").innerHTML = "Enemy defeated!";
        document.getElementById("rollBtn").disabled = true;

        showReturnBtn();
    }

    if (playerHP <= 0) {
        document.getElementById("FinalResult").innerHTML = "You were defeated!";
        document.getElementById("rollBtn").disabled = true;

        showReturnBtn();
    }
}

function showReturnBtn() {
    document.getElementById("return").style.display = "inline-block";
}

function returnToPreviousPage() {
    window.history.back();
}

// BUTTON LISTENER

document.getElementById("rollBtn")
    .addEventListener("click", startBattle);

document.getElementById("return")
    .addEventListener("click", returnToPreviousPage);    

// Initialize HP display
updateHPDisplay();