// ===============================
// GET SCENE FROM URL
// ===============================
const urlParams = new URLSearchParams(window.location.search);
const scene = urlParams.get("scene");

let stageSlots = [null, null, null]; // [left, right, center]
let replaceIndex = 0; // controls replacement order

// ===============================
// CHARACTER DATABASE
// ===============================
const characters = {
    Ed: "imgs/chara/Ed.png",
    Zael: "imgs/chara/Za'el.png",
    Alann: "imgs/chara/Alann.png",
    Jiiva: "imgs/chara/Jiiva.png",
    Merchant: "imgs/chara/Merchant.png",
    Fisherman: "imgs/chara/fisherman.png",
    MysteriousPerson: "imgs/chara/samurai_yasuke.png",
    Kuma: "imgs/chara/kuma.png"
};

let activeCharacters = [];

// ===============================
// ELEMENT REFERENCES
// ===============================
const nameDisplay = document.getElementById("character-name");
const background = document.getElementById("background");
const dialogueText = document.getElementById("dialogue-text");

// ===============================
// STORY DATABASE
// ===============================
const stories = {

    inn: {
        background: "imgs/bg/innBg.png",
        dialogue: [
            { speaker: "Ed", text: "I'm bac- God Damn the entire room reeks of ale. Were you drinking the entire night Za'el?" },
            { speaker: "Za'el", text: "Sorry, the ale deal was so good so I bought the entire barrel and ended up finished it in one go." },
            { speaker: "Ed", text: "You better clean the room after taking a bath. God, I better open all the windows to let fresh air replace the smell." },
            { speaker: "Za'el", text: "<Burps> My bad G." }
        ]
    },

    townsquare: {
        background: "imgs/bg/townsquare.png",
        dialogue: [
            { speaker: "Jiiva", text: "Hmmmm..." },
            { speaker: "Merchant", text: "Well is there anything you like? Better be quick or others will buy ya marked thing." },
            { speaker: "Jiiva", text: "(I only have enough coins for one Spinosarus figure. Which one should I grab...)" },
            { speaker: "Event", text: "A few moments later" },
            { speaker: "Merchant", text: "Sir? you have been standing still for 30 minutes straight." },
            { speaker: "Jiiva", text: "(Maybe I'll grab both with the coins that Ed gave me for tonight's groceries" },
            { speaker: "Jiiva", text: "Well sir I'll get both figures of Spinosarus-" },
            { speaker: "Merchant", text: "Boy they all sold out 15 minutes ago." }
        ]
    },

    garden: {
        background: "imgs/bg/garden.png",
        dialogue: [
            { speaker: "Za'el", text: "I wonder if he will like those flowers." },
            { speaker: "Ed", text: "Is it for me?" },
            { speaker: "Za'el", text: "Yeah..." },
            { speaker: "Event", text: ". . ." },
            { speaker: "Za'el", text: "N-No!! What are you doing here Ed. Aren't you supposed to be performing right now at an event in townsquare?" },
            { speaker: "Ed", text: "Oh that, I've done my part so I decided to wander around the city and I saw you entering the garden." },
            { speaker: "Za'el", text: "Next time don't tease me like that." }
        ]
    },

    market: {
        background: "imgs/bg/market.png",
        dialogue: [
            { speaker: "Za'el", text: "These fruits seem fresh." },
            { speaker: "Ed", text: "But the prices though, they are a bit more expensive than the usual ones." },
            { speaker: "Za'el", text: "Maybe because they are from another kingdo- " },
            { speaker: "Za'el", text: "Ed we don't have enough time for a performance we got places to be remember." },
            { speaker: "Ed", text: "But this will be quic-" },
            { speaker: "Za'el", text: "No but. Come on get moving." }
        ]
    },

    castle: {
        background: "imgs/bg/castleBg.png",
        dialogue: [
            { speaker: "Alann", text: "No don't you dare Ed." },
            { speaker: "Ed", text: "Dude I am not even doing anything at all. Why do you hate me so much." },
            { speaker: "Alann", text: "I know you're gonna sneak into the castle and perform in front of the princess again!" },
            { speaker: "Ed", text: "Well. . . ." },
            { speaker: "Alann", text: "We going back now." }

        ]
    },

    port: {
        background: "imgs/bg/port.png",
        dialogue: [
            { speaker: "Jiiva", text: "Well there goes another team from our Guild to hunt a Spinosaraus..." },
            { speaker: "Ed", text: "Why didn't you go with them, we all know that you want to go to that Jurassic Land." },
            { speaker: "Alann", text: "Let him be Ed-" },
            { speaker: "Ed", text: "Nuh uh, he has been whining since the guild discovered a way to reach that island." },
            { speaker: "Za'el", text: "You two stop the non-sense argument and pick a quest instead. We are running low on coins for this week." },
            { speaker: "Jiiva", text: "Can you do dinosaurs related quest? I want to see them." }
        ]
    },

    lake: {
        background: "imgs/bg/lakebg.jpg",
        dialogue: [
            { speaker: "Alann", text: "Let's see my quest is to slay a giant Hermit Crab near this lak-" },
            { speaker: "Fisherman", text: "Nice day for fishing innit hu ha." },
            { speaker: "Alann", text: "Eh.. Yeah it sure is a great day." },
            { speaker: "Fisherman", text: "Nice day for fishing innit hu ha." },
            { speaker: "Alann", text: "Yeah yeah I heard it the first time loud and clear." },
            { speaker: "Fisherman", text: "Nice day for fishing innit hu ha." },
            { speaker: "Alann", text: "Are you.. Can you even speak anything at all aside from that?" },
            { speaker: "Fisherman", text: "Nice day for fishing innit hu ha." },
            { speaker: "Alann", text: "(God he's stuck with one dialogue)" }
        ]
    },

    ravine: {
        background: "imgs/bg/woods.png",
        dialogue: [
            { speaker: "Ed", text: "Why is this path quiet. It is usually busy with all travellers and animals." },
            { speaker: "Za'el", text: "Yeah it sure is a bit weird." },
            { speaker: "MysteriousPerson", text: "止まりなさい皆の者." },
            { speaker: "Ed", text: "What language is that? Any idea Jiiva?" },
            { speaker: "Jiiva", text: "Sorry never heard of that language befrore. This is my first time." },
            { speaker: "MysteriousPerson", text: "この先に大熊は 暴れているので 他の道を使んでください." },
            { speaker: "Alann", text: "Is he trying to warn us? or mug us?" },
            { speaker: "MysteriousPerson", text: "あいつは十人の命をもう奪った だからハンタータクト様が片付けてる途中に こちに来ないでください." },
            { speaker: "Alann", text: "I think we should just quickly run past him." },
            { speaker: "Jiiva", text: "Yeah I support that. This conversation isn't making any progress so we should just move forward." },
            { speaker: "MysteriousPerson", text: "皆の物 あっちはダメです こちに戻りなさい-" },
            { speaker: "Event", text: "A few minutes later" },
            { speaker: "Za'el", text: "I think we've lost that person. It should be fine to stop running." },
            { speaker: "Ed", text: "Coming out of nowhere and started speaking in a language no one understands. Although I wonder that is he trying to say." },
            { speaker: "Jiiva", text: "Maybe he is trying to tell us that there is a monster up ahead? If it is true we're done for. We didn't bring any of our battle equipments." },
            { speaker: "Za'el", text: "Ah" },
            { speaker: "Za'el", text: "Ed, don't look back and walk slowly towards us." },
            { speaker: "Ed", text: "Why are you guys looking like that. Is there a giant bear behind me? Stop joking around keep on moving come on." },
            { speaker: "Kuma", text: "<ゴホッ>" },
            { speaker: "Ed", text: "SO IT WAS A WARNING." }
        ]
    }

};

// ===============================
// LOAD STORY
// ===============================
const storyData = stories[scene];

let dialogue = [];
let currentLine = 0;

if (storyData) {
    dialogue = storyData.dialogue;

    if (storyData.background) {
        background.src = storyData.background;
    }
} else {
    dialogue = [
        { speaker: "Ed", text: "This story does not exist." }
    ];
}

function normalizeName(name) {
    return name.replace(/[^A-Za-z]/g, "");
}

// ===============================
// SETUP CHARACTERS FOR SCENE
// ===============================
function updateCharacterStage(speaker) {

    const container = document.getElementById("story-container");
    const key = normalizeName(speaker);

    // If already on stage, just highlight later
    if (stageSlots.includes(key)) {
        return;
    }

    // Check for empty slot first
    let emptyIndex = stageSlots.indexOf(null);

    if (emptyIndex !== -1) {
        stageSlots[emptyIndex] = key;
        createCharacter(key, emptyIndex);
    }
    else {
        // Replace using fixed order: left → right → center
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

// ===============================
// UPDATE DIALOGUE
// ===============================
function updateDialogue() {

    if (currentLine >= dialogue.length) {
        window.history.back();
        return;
    }

    const currentSpeaker = dialogue[currentLine].speaker;
    const key = normalizeName(currentSpeaker);

    dialogueText.textContent = dialogue[currentLine].text;
    nameDisplay.textContent = currentSpeaker; // keep apostrophe in UI

    // Update stage (dynamic system)
    updateCharacterStage(currentSpeaker);

    // Dim all characters AND reset z-index
    document.querySelectorAll(".character").forEach(char => {
        char.style.filter = "brightness(60%)";
        char.style.zIndex = "2";
    });

    // Highlight active speaker and bring to front
    const activeChar = document.getElementById(key);
    if (activeChar) {
        activeChar.style.filter = "brightness(100%)";
        activeChar.style.zIndex = "5";
    }
}

// ===============================
// EVENT LISTENERS
// ===============================
document.getElementById("dialogue-box").addEventListener("click", () => {
    currentLine++;
    updateDialogue();
});

document.getElementById("menuBtn").addEventListener("click", () => {
    window.history.back();
});

// ===============================
// INITIALIZE SCENE
// ===============================
updateDialogue();