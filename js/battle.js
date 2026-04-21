console.log("Return URL:", localStorage.getItem("returnURL"));
// CHARACTER DATA
const characters = {
    Alann: {
        name: "Alann",
        hp: 200,
        maxHP: 200,
        atk: 19,
        img: "imgs/chara/Alann.png"
    },
    Zael: {
        name: "Za'el",
        hp: 120,
        maxHP: 120,
        atk: 25,
        img: "imgs/chara/Za'el.png"
    },
    Ed: {
        name: "Ed",
        hp: 150,
        maxHP: 150,
        atk: 22,
        img: "imgs/chara/Ed.png"
    },
    Jiiva: {
        name: "Jiiva",
        hp: 90,
        maxHP: 90,
        atk: 35,
        img: "imgs/chara/Jiiva.png"
    }
};

const enemies = {
    Kuma: {
        name: "Bear",
        hp: 130,
        maxHP: 130,
        atk: 25,
        img: "imgs/chara/kuma.png"
    },
    Knight: {
        name: "Knight",
        hp: 110,
        maxHP: 110,
        atk: 19,
        img: "imgs/chara/Knight.png"
    },
    Lieutenant: {
        name: "Lieutenant",
        hp: 150,
        maxHP: 150,
        atk: 25,
        img: "imgs/chara/Lieutenant.png"
    },
    EruneThug: {
        name: "Erune Thug",
        hp: 100,
        maxHP: 100,
        atk: 20,
        img: "imgs/chara/3991125000.png"
    },
    Minotaur: {
        name: "Minotaur",
        hp: 175,
        maxHP: 175,
        atk: 28,
        img: "imgs/chara/3990780000.png"
    },
    FallenHalo: {
        name: "Fallen Halo",
        hp: 250,
        maxHP: 250,
        atk: 11,
        img: "imgs/chara/3990620000.png"
    },
    Goblin: {
        name: "Goblin",
        hp: 90,
        maxHP: 90,
        atk: 23,
        img: "imgs/chara/3990143000.png"
    },
    Avatar: {
        name: "Avatar",
        hp: 500,
        maxHP: 500,
        atk: 1,
        img: "imgs/chara/avatar.png"
    }
};

const storyBattles = {
    alann_vs_knight: {
        player: "Alann",
        enemy: "Knight"
    },
    alann_vs_lieutenant: {
        player: "Alann",
        enemy: "Lieutenant"
    },
    zael_vs_knight: {
        player: "Zael",
        enemy: "Knight"
    },
    ed_vs_thug: {
        player: "Ed",
        enemy: "EruneThug"
    },
    jiiva_vs_knight: {
        player: "Jiiva",
        enemy: "Knight"
    },
    alann_vs_goblin: {
        player: "Alann",
        enemy: "Goblin"
    },
    ed_vs_kuma: {
        player: "Ed",
        enemy: "Kuma"
    },
    ed_vs_avatar: {
        player: "Ed",
        enemy: "Avatar"
    }
};

// GAME STATE
let player;
let enemy;
let playerTurn = true;
let battleStarted = false;

// DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", () => {

    const battleID = localStorage.getItem("battleID");

    const overlay = document.getElementById("overlay");
    const playerSelect = document.getElementById("playerSelect");
    const confirmBtn = document.getElementById("confirmSelection");

    // STORY MODE
    if (battleID && storyBattles[battleID]) {

        const battle = storyBattles[battleID];

        localStorage.setItem("lastBattleID", battleID);

        loadBattle(battle.player, battle.enemy);

        overlay.style.display = "none";
        localStorage.removeItem("battleID");
        const battleMusic = document.getElementById("battleMusic");
        battleMusic.currentTime = 0;
        battleMusic.volume = 0.5;
        battleMusic.play();
    }
    // DUNGEON MODE
    else {


        for (let charKey in characters) {
            const option = document.createElement("option");
            option.value = charKey;
            option.text = characters[charKey].name;
            playerSelect.appendChild(option);
        }

        confirmBtn.addEventListener("click", () => {
            localStorage.setItem("battleMode", "dungeon");
            localStorage.removeItem("lastBattleID");
            const chosenPlayer = playerSelect.value;
            const randomEnemyKey = getRandomEnemyKey();

            loadBattle(chosenPlayer, randomEnemyKey);
            overlay.style.display = "none";

            const battleMusic = document.getElementById("battleMusic");
            battleMusic.currentTime = 0;
            battleMusic.volume = 0.3;
            battleMusic.play();
        });
    }

    // Buttons (always active)
    document.getElementById("returnBtn").addEventListener("click", returnToPreviousPage);
    document.getElementById("retryBtn").addEventListener("click", retryBattle);
    document.getElementById("rollBtn").addEventListener("click", startBattle);

});

function resetBattleState() {

    playerTurn = true;
    battleStarted = false;

    document.getElementById("rollBtn").disabled = false;
    document.getElementById("rollBtn").innerText = "Roll Dice";

    document.getElementById("FinalResult").innerHTML = "";
    document.getElementById("DiceRoll").innerHTML = "";
    document.getElementById("EventResult").innerHTML = "";
    document.getElementById("DealDamage").innerHTML = "";

    document.getElementById("endButtons").style.display = "none";

    // Remove grayscale effects
    document.querySelector(".playerImg").classList.remove("defeated");
    document.querySelector(".enemyImg").classList.remove("defeated");
}

// RANDOM ENEMY
function getRandomEnemyKey() {
    const enemyKeys = Object.keys(enemies);
    return enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
}

// LOAD BATTLE
function loadBattle(playerChoice, enemyChoice) {

    localStorage.setItem("lastPlayerKey", playerChoice);
    localStorage.setItem("lastEnemyKey", enemyChoice);

    player = {
        ...characters[playerChoice],
        hp: characters[playerChoice].maxHP
    };

    enemy = {
        ...enemies[enemyChoice],
        hp: enemies[enemyChoice].maxHP
    };

    document.querySelector(".playerImg").src = player.img;
    document.querySelector(".enemyImg").src = enemy.img;

    updateHPDisplay();
}

// DICE SYSTEM
function diceRoll() {
    return Math.floor(Math.random() * 20) + 1;
}

function checkDiceRoll(num) {
    if (num === 1) return "Bad";
    else if (num <= 5) return "Fine";
    else if (num <= 10) return "Ok";
    else if (num <= 16) return "Good";
    else if (num <= 19) return "High";
    else return "Critical";
}

// DAMAGE SYSTEM
function dealDamage(roll, atk, event) {
    if (event === "Bad") return 0;
    if (event === "Fine") return atk + (roll - 6);
    if (event === "Ok") return atk + roll;
    if (event === "Good") return atk + roll + 5;
    if (event === "High") return atk + roll + 8;
    return atk + roll + 12;
}

// UI
function updateHPDisplay() {
    if (!player || !enemy) return;

    const pMax = player.maxHP || player.maxHp; 
    const eMax = enemy.maxHP || enemy.maxHp;

    let playerPercent = (player.hp / pMax) * 100;
    let enemyPercent = (enemy.hp / eMax) * 100;

    const pBar = document.getElementById("playerHpBar");
    if (pBar) {
        pBar.style.width = playerPercent + "%";
    }

    const eBar = document.getElementById("enemyHpBar");
    if (eBar) {
        eBar.style.width = enemyPercent + "%";
    }

    document.getElementById("PlayerHP").innerHTML = player.name + " HP: " + player.hp + "<br><br>Atk: " + player.atk;
    document.getElementById("EnemyHP").innerHTML = enemy.name + " HP: " + enemy.hp + "<br><br>Atk: " + enemy.atk;
}

// BATTLE LOGIC
function startBattle() {

    if (!battleStarted) {
        battleStarted = true;
        document.getElementById("rollBtn").innerText = "Next Turn";
    }

    if (player.hp <= 0 || enemy.hp <= 0) return;

    if (player.hp <= 0 || enemy.hp <= 0) return;

    let roll = diceRoll();
    let event = checkDiceRoll(roll);
    let damage;

    document.getElementById("DiceRoll").innerHTML = "Roll: " + roll;
    document.getElementById("EventResult").innerHTML = "Result: " + event;

    let damageLine = document.getElementById("DealDamage");

    if (playerTurn) {
        damage = dealDamage(roll, player.atk, event);
        enemy.hp -= damage;
        damageLine.style.color = "teal";

        if (damage === 0) damageLine.innerHTML = player.name + " missed!";
        else if (event === "Critical") damageLine.innerHTML = player.name + " dealt " + damage + " CRITICAL damage!";
        else damageLine.innerHTML = player.name + " dealt " + damage + " damage!";

        playerTurn = false;


    } else {
        damage = dealDamage(roll, enemy.atk, event);
        player.hp -= damage;
        damageLine.style.color = "red";

        if (damage === 0) damageLine.innerHTML = enemy.name + " missed!";
        else if (event === "Critical") damageLine.innerHTML = enemy.name + " dealt " + damage + " CRITICAL damage!";
        else damageLine.innerHTML = enemy.name + " dealt " + damage + " damage!";

        playerTurn = true;
    }

    // Prevent negative HP
    if (enemy.hp < 0) enemy.hp = 0;
    if (player.hp < 0) player.hp = 0;

    updateHPDisplay();
    checkBattleEnd();
}

// END BATTLE
function checkBattleEnd() {
    const battleMusic = document.getElementById("battleMusic");
    const victorySound = document.getElementById("victorySound");
    const defeatSound = document.getElementById("defeatSound");

    if (enemy.hp <= 0) {
        document.getElementById("FinalResult").innerHTML = enemy.name + " defeated!";
        document.getElementById("rollBtn").disabled = true;
        showEndButtons(true);

        battleMusic.pause();
        victorySound.play();

        // Gray out enemy image
        document.querySelector(".enemyImg").classList.add("defeated");
    }

    if (player.hp <= 0) {
        document.getElementById("FinalResult").innerHTML = "You were defeated!";
        document.getElementById("rollBtn").disabled = true;
        showEndButtons(false);

        battleMusic.pause();
        defeatSound.play();

        // Gray out player image
        document.querySelector(".playerImg").classList.add("defeated");
    }

    localStorage.removeItem("battleMode");
}


function showEndButtons(isVictory) {
    const container = document.getElementById("endButtons");
    const retryBtn = document.getElementById("retryBtn");

    container.style.display = "flex";

    if (isVictory) retryBtn.style.display = "none";
    else retryBtn.style.display = "inline-block";
}

function returnToPreviousPage() {

    const mode = localStorage.getItem("battleMode");
    if (mode === "story") {

        const scene = localStorage.getItem("returnScene");
        const type = localStorage.getItem("returnType") || "main";

        if (scene) {
            window.location.href = `story.html?type=${type}&scene=${scene}`;
        } else {
            window.location.href = "index.html";
        }
    }
    else {
        window.history.back();
    }
}

function retryBattle() {

    const mode = localStorage.getItem("battleMode");

    resetBattleState();

    if (mode === "story") {

        const battleID = localStorage.getItem("lastBattleID");

        if (battleID && storyBattles[battleID]) {
            const battle = storyBattles[battleID];
            loadBattle(battle.player, battle.enemy);
        }
    }

    else {

        const playerKey = localStorage.getItem("lastPlayerKey");
        const enemyKey = localStorage.getItem("lastEnemyKey");

        if (playerKey && enemyKey) {
            loadBattle(playerKey, enemyKey);
        } else {
            location.reload();
        }
    }
}