// GET SCENE FROM URL

const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type") || "main"; // default main
const scene = urlParams.get("scene");

let stageSlots = [null, null, null]; // [left, right, center]
let replaceIndex = 0; // controls replacement order

// GMAE STATE
let gameState = {
    mode: "main",
    progress: 0
};

const saved = localStorage.getItem("gameState");
if (saved) {
    gameState = JSON.parse(saved);
}

const bgmPlayer = document.getElementById("bgm");


function handleLocation(scene) {

    if (gameState.mode === "main") {

        const currentMQ = mainStoryOrder[gameState.progress];

        if (scene === currentMQ) {
            location.href = `story.html?type=main&scene=${scene}`;
        } else {
            alert("You haven't unlocked this yet!");
        }

    } else {
        location.href = `story.html?type=side&scene=${scene}`;
    }
}

// CHARACTER DATABASE

const characters = {
    Ed: "imgs/chara/Ed.png",
    Zael: "imgs/chara/Za'el.png",
    Alann: "imgs/chara/Alann.png",
    Jiiva: "imgs/chara/Jiiva.png",
    Uliet: "imgs/chara/Uliet.png",
    Guine: "imgs/chara/Guine.png",
    Lieutenant: "imgs/chara/Lieutenant.png",
    Knight: "imgs/chara/Knight.png",
    KnightA: "imgs/chara/Knight.png",
    KnightB: "imgs/chara/Knight.png",
    Merchant: "imgs/chara/Merchant.png",
    Fisherman: "imgs/chara/fisherman.png",
    MysteriousPerson: "imgs/chara/samurai_yasuke.png",
    Kuma: "imgs/chara/kuma.png",
    Mirako: "imgs/chara/eto_uma_kotatsu.png",
    Horse: "imgs/chara/animal_kisouma.png"
};

let activeCharacters = [];

// ELEMENT REFERENCES

const nameDisplay = document.getElementById("character-name");
const background = document.getElementById("background");
const dialogueText = document.getElementById("dialogue-text");

let currentLine = parseInt(localStorage.getItem("storyIndex")) || 0;

function normalizeName(name) {
    return name.replace(/[^A-Za-z]/g, "");
}

fetch("json/stories.json")
    .then(response => response.json())
    .then(stories => {

        const storyData = stories[type]?.[scene];

        if (storyData) {

            dialogue = storyData.events || storyData.dialogue;

            if (storyData.background) {
                background.src = storyData.background;
            }
            if (storyData.bgm) {
                bgmPlayer.src = storyData.bgm;
                bgmPlayer.volume = 0.5;
                bgmPlayer.play().catch(() => {
                    console.log("Autoplay blocked");
                });
            }

        } else {

            dialogue = [
                { speaker: "Mirako", text: "To be continued." }
            ];

        }

        updateDialogue();

        localStorage.removeItem("storyIndex");

    });
// SETUP CHARACTERS FOR SCENE
function updateCharacterStage(speaker) {

    const container = document.getElementById("story-container");
    const key = normalizeName(speaker);

    if (stageSlots.includes(key)) {
        return;
    }

    let emptyIndex = stageSlots.indexOf(null);

    if (emptyIndex !== -1) {
        stageSlots[emptyIndex] = key;
        createCharacter(key, emptyIndex);
    }
    else {
        const oldKey = stageSlots[replaceIndex];

        const oldElement = document.getElementById(oldKey);
        if (oldElement) oldElement.remove();

        stageSlots[replaceIndex] = key;
        createCharacter(key, replaceIndex);

        replaceIndex = (replaceIndex + 1) % 3;
    }

    console.log("Stage Slots:", stageSlots);
}

function createCharacter(key, slotIndex) {

    const container = document.getElementById("story-container");

    if (!characters[key]) {
        console.error("Character not found:", key);
        return;
    }

    const img = document.createElement("img");
    img.src = characters[key];
    img.id = key;
    img.classList.add("character");

    // Assign fixed slot
    if (slotIndex === 0) img.classList.add("left");
    if (slotIndex === 1) img.classList.add("right");
    if (slotIndex === 2) img.classList.add("center");

    img.style.filter = "brightness(60%)";
    img.style.zIndex = "2";

    container.appendChild(img);
}

// UPDATE DIALOGUE

const faeeChapters = [5, 6, 7, 8, 9, 10];

function updateDialogue() {
    if (currentLine >= dialogue.length) {
        if (type === "main") {

            const expectedScene = mainStoryOrder[gameState.progress];

            if (scene?.toLowerCase() === expectedScene?.toLowerCase()) {
                
                const finishedIndex = gameState.progress;
                
                gameState.progress++;
                localStorage.setItem("gameState", JSON.stringify(gameState));

                if (gameState.progress >= mainStoryOrder.length) {
                    window.location.href = "credits.html";
                    return;
                }

                if (faeeChapters.includes(finishedIndex)) {
                    window.location.href = "faee.html";
                    return;
                }
            }
        }


        window.history.back();
        return;
    }

    const event = dialogue[currentLine];

    if (event.type === "battle") {
        triggerBattle(event.battleID);
        return;
    }
    // NORMAL DIALOGUE
    const currentSpeaker = event.speaker;
    const key = normalizeName(currentSpeaker);

    dialogueText.textContent = event.text;
    nameDisplay.textContent = currentSpeaker;

    updateCharacterStage(currentSpeaker);

    // Dim all
    document.querySelectorAll(".character").forEach(char => {
        char.style.filter = "brightness(60%)";
        char.style.zIndex = "2";
    });

    // Highlight speaker
    const activeChar = document.getElementById(key);
    if (activeChar) {
        activeChar.style.filter = "brightness(100%)";
        activeChar.style.zIndex = "5";
    }
}

// EVENTS
document.getElementById("dialogue-box").addEventListener("click", () => {
    currentLine++;
    updateDialogue();
});

document.getElementById("menuBtn").addEventListener("click", () => {
    window.history.back();
});

function processStoryEvent(event) {

    if (event.type === "dialogue") {
        showDialogue(event.text);
    }

    if (event.type === "battle") {
        triggerBattle(event.battleID);
    }
}

function triggerBattle(battleID) {

    localStorage.setItem("battleID", battleID);
    localStorage.setItem("battleMode", "story");

    // Save progress
    localStorage.setItem("storyIndex", currentLine + 1);
    localStorage.setItem("returnScene", scene);
    localStorage.setItem("returnType", type);

    window.location.href = "battle.html";
}