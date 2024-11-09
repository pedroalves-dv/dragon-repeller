const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const xpBar = document.getElementById("xpBar");
const healthText = document.querySelector("#healthText");
const healthBar = document.getElementById("healthBar");
const goldText = document.querySelector("#goldText");

const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthBar = document.querySelector("#monsterHealthBar");
const monsterElement = document.getElementById("monsterElement");
const monsterElementContainer = document.getElementById("monsterElementContainer");

const weapons = [
  { name: "Old Stick", power: 5 },
  { name: "Dagger", power: 30 },
  { name: "Claw hammer", power: 50 },
  { name: "Two-Handed Sword", power: 100 },
];

const inventoryButton = document.getElementById("inventoryButton");
const inventoryDisplay = document.getElementById("inventory");
const inventoryList = document.getElementById("inventoryList");

let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Old Stick"];

// Player Animations
const playerElement = document.getElementById("player");
const frameCount = 4; // Number of frames in the animation
let currentFrame = 0; // Current frame index
const frameInterval = 400; // Milliseconds per frame, adjust for speed


const PlayeridleFrames = [];
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = `./assets/Sprites/Player/idle/idle-export${i}.png`;
  PlayeridleFrames.push(img.src);
}

// Animation function
function animatePlayer() {
  playerElement.style.backgroundImage = `url('${PlayeridleFrames[currentFrame]}')`;
  playerElement.style.backgroundSize = 'cover'; // Ensure image scales within box
  // make the player bigger
  playerElement.style.width = '100px';
  playerElement.style.height = '100px';
  playerElement.style.backgroundPosition = 'center -20px'; // Center image
  playerElement.style.backgroundRepeat = 'no-repeat'; // Prevent repeat
  currentFrame = (currentFrame + 1) % frameCount;
}

// Animate player
setInterval(animatePlayer, frameInterval);

const monsters = [
  {
    name: "One-eyed Vilandra",
    level: 2,
    health: 35,
    frameInterval: 500,
    idleFrames: Array.from({ length: 8 }, (_, i) => `./assets/Sprites/flying-eye-demon/flying-eye-demon${i + 1}.png`),
    attackFrames: Array.from({ length: 3 }, (_, i) => `./assets/Sprites/Hit/hit${i + 1}.png`),
    deathFrames: Array.from({ length: 8 }, (_, i) => `./assets/Sprites/EnemyDeath/enemy-death${i + 1}.png`),
    idleFrameCount: 8,    // Frame count for idle animation
    attackFrameCount: 3,  // Frame count for attack animation
    deathFrameCount: 8    // Frame count for death animation
  },
  {
    name: "Ogrum the Fanged Beast",
    level: 8,
    health: 90,
    frameInterval: 500,
    idleFrames: Array.from({ length: 4 }, (_, i) => `./assets/Sprites/Ogre/Idle/ogre-idle${i + 1}.png`),
    attackFrames: Array.from({ length: 7 }, (_, i) => `./assets/Sprites/Hit/hit${i + 1}.png`),
    deathFrames: Array.from({ length: 8 }, (_, i) => `./assets/Sprites/EnemyDeath/enemy-death${i + 1}.png`),
    idleFrameCount: 4,    // Frame count for idle animation
    attackFrameCount: 7,  // Frame count for attack animation
    deathFrameCount: 8    // Frame count for death animation
    
  },
  {
    name: "Apex Wyrm",
    level: 20,
    health: 320,
    frameInterval: 500,
    idleFrames: Array.from({ length: 6 }, (_, i) => `./assets/Sprites/Grotto-escape-2-boss-dragon/sprites/idle/dragon${i + 1}.png`),
    attackFrames: Array.from({ length: 7 }, (_, i) => `./assets/Sprites/Hit/hit${i + 1}.png`),
    deathFrames: Array.from({ length: 8 }, (_, i) => `./assets/Sprites/EnemyDeath/enemy-death${i + 1}.png`),
    idleFrameCount: 6,    // Frame count for idle animation
    attackFrameCount: 7,  // Frame count for attack animation
    deathFrameCount: 8    // Frame count for death animation
  },
];

let monsterState = "idle";  // Possible values: 'idle', 'attacking', 'dead'
let monsterCurrentFrame = 0;
const monsterFrameInterval = 300; // Adjust this based on desired speed

// Update monsterElement size based on the monster's sprite
function updateMonsterElementSize() {
  
  // Load the first frame of the current monster (or any key frame)
  const img = new Image();
  img.src = monsters[fighting].idleFrames[0]; // Use idleFrames or any key frame

  img.onload = function() {
    // Adjust the size of the monster element based on the image's natural dimensions
    const scale = 100 / img.height;
    monsterElement.style.width = `${img.width * scale}px`;
    monsterElement.style.height = `${img.height * scale}px`;

    // Optionally adjust the background position if needed based on orientation
    // For example, if the monster's sprite is facing a different direction, you could apply a scaleX to flip it:
    // Adjust any specific properties based on the monster's name
    if (monsters[fighting].name === "One-eyed Vilandra") {
      // reset monsterElement styles
      monsterElement.style.marginBottom = '0px';
      monsterElement.style.marginLeft = '0px';
      monsterElement.style.marginRight = '0px';
      // change
      monsterElement.style.transform = 'scaleX(-1)'; // Flip the monster image
    } else if (monsters[fighting].name === "Ogrum the Fanged Beast") {
      // reset monsterElement styles
      monsterElement.style.marginBottom = '0px';
      monsterElement.style.marginLeft = '0px';
      monsterElement.style.marginRight = '0px';
      monsterElement.style.transform = '';
      //change
      monsterElement.style.height = `${img.height * scale * 1.5}px`;
      monsterElement.style.width = `${img.width * scale * 1.2}px`;
      monsterElement.style.marginBottom = '30px'; 
      monsterElement.style.marginLeft = '110px';
       // Slightly larger scale for Ogrum
    } else if (monsters[fighting].name === "Apex Wyrm") {
      // reset monsterElement styles
      monsterElement.style.transform = '';
      monsterElement.style.marginBottom = '0px';
      monsterElement.style.marginLeft = '0px';
      monsterElement.style.marginRight = '0px';
      // change
      monsterElement.style.width = `${img.width * scale * 1.8}px`;
      monsterElement.style.height = `${img.height * scale * 1.8}px`;
      monsterElement.style.marginBottom = '90px';
      monsterElement.style.transform = 'translateX(-80px)'; // Center the monster image

    }
  };
}

function animateMonster() {

  if (fighting < 0 || fighting >= monsters.length) {
    console.error("Invalid monster index:", fighting);
    return;
  }

  let frames;

  switch (monsterState) {
    case "attacking":
      frames = monsters[fighting].attackFrames;
      break;
    case "dead":
      frames = monsters[fighting].deathFrames;
      break;
    case "idle":
    default:
      frames = monsters[fighting].idleFrames;
      break;
  }

  if (!frames) {
    console.error("Frames are undefined for state:", monsterState);
    return;
  }

  // Set the background image based on the current frame of the animation
  monsterElement.style.backgroundImage = `url('${frames[monsterCurrentFrame]}')`;
  monsterElement.style.backgroundSize = 'contain';
  monsterElement.style.backgroundPosition = 'center';
  monsterElement.style.backgroundRepeat = 'no-repeat';

  // Move to the next frame and loop back to 0 if at the end
  monsterCurrentFrame = (monsterCurrentFrame + 1) % frames.length;
}


// Update Inventory Display
function updateInventoryDisplay() {
  inventoryList.innerHTML = "";

  inventory.forEach((item) => {
    const listItem = document.createElement("li");

    // Create the weapon icon based on the weapon name
    const icon = document.createElement("div");
    icon.classList.add("weapon-icon");

    switch (item) {
      case "Old Stick":
        icon.classList.add("weapon-stick");
        break;
      case "Dagger":
        icon.classList.add("weapon-dagger");
        break;
      case "Claw hammer":
        icon.classList.add("weapon-hammer");
        break;
      case "Two-Handed Sword":
        icon.classList.add("weapon-sword");
        break;
      default:
        icon.classList.add("weapon-stick");
        break;
    }

    listItem.appendChild(icon); // Append the icon to the list item
    // listItem.appendChild(document.createTextNode(item)); // Append the item text to the list item
    inventoryList.appendChild(listItem);
  });
}

// Toggle Inventory Display
inventoryButton.onclick = () => {
  const isInventoryVisible = !inventoryDisplay.classList.contains("hidden");
  inventoryDisplay.classList.toggle("hidden", isInventoryVisible);
};

updateInventoryDisplay();

function updateHealth(health) {
  healthBar.style.width = `${health}%`;
}
updateHealth(health);

function updateXP(xp) {
  xpBar.style.width = `${xp}%`;
}
updateXP(xp);

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: `You are in the town square.\nLights dimly shine from a small shack's window, a decrepit sign reads "Store".\n Faint echoes are coming from a hole in the earth.\nAnd in the distance, clouds give way to a giant shadow...`,
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health\n(10 gold)",
      "Buy weapon\n(30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store...",
  },
  {
    name: "cave",
    "button text": ["Fight Vilandra", "Fight Ogrum", "Go to town square"],
    "button functions": [fightVilandra, fightOgrum, goTown],
    text: "It's pitch black, and wet... You see something approaching.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: `You are fighting a {monsterName}.`,
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Pooplershmeglesteinhhhh!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You've died.",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You've defeated the Apex Wyrm! YOU WIN THE GAME!",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret numericon. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, it might open!",
  },
];

function getLocationText(location) {
  let text = location.text;
  if (typeof fighting !== 'undefined' && fighting >= 0 && fighting < monsters.length) {
    text = text.replace("{monsterName}", monsters[fighting].name);
  }
  return text;
}

// Type text with fade-in effect
function typeText(text, speed = 30) {
  const textBox = document.getElementById("text");
  textBox.innerHTML = ""; // Clear previous text
  textBox.classList.add("fade-text"); // Add the class for fade-in styling

  // Insert each character inside a <span> so we can control its opacity
  text.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.innerText = char;
    textBox.appendChild(span);

    // Apply the fade-in effect with a delay for each character
    setTimeout(() => span.classList.add("visible"), index * speed);
  });
}

// Initial text
document.addEventListener("DOMContentLoaded", () => {
  const initialText =
    "The cold wind rises. And with it, the boiling fires of the deep. No soul dares dwell in the open.\nFor the world was taken, and belonged to man no more.\n\nYet, some lights still flicker...";
  typeText(initialText);
});

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
// Button event listeners
document.addEventListener("DOMContentLoaded", () => {
  const enterTownButton = document.getElementById("button0");
  const otherButtons = [
    document.getElementById("button1"),
    document.getElementById("button2"),
    document.getElementById("button3"),
  ];

  enterTownButton.addEventListener("click", () => {
    enterTownButton.classList.add("hidden");
    otherButtons.forEach((button) => button.classList.remove("hidden"));
    goTown();
  });
});

// Update the game state
function update(location) {
  if (location === locations[3] || location === locations[4]) {
    monsterStats.style.display = "flex";
  } else {
    monsterStats.style.display = "none";  // Hide otherwise
  }
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = getLocationText(location);

  typeText(getLocationText(location)); // Use the typewriter effect for updating the text
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health = Math.min(health + 10, 200); // Ensure health doesn’t exceed 200
    goldText.innerText = gold;

    updateHealth(health); // Update health bar visually
    typeText("You've bought 10 health!");
  } else {
    typeText("You do not have enough gold to buy health... Oh, the humanity!");
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      inventory.push(newWeapon);
      typeText(`You now have a ${newWeapon}! Such power!`);
      updateInventoryDisplay();
    } else {
      typeText("You do not have enough gold to buy a weapon.");
    }
  } else {
    typeText(`You already have the most powerful weapon!`);
    typeText(`Sell weapon for 15 gold`);
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    typeText(
      `You sold your ${currentWeapon}. Farewell, old friend.\nIn your inventory you have: ${inventory}`
    );
  } else {
    typeText(
      `Don't sell your only weapon! You might find the killing monsters difficult without it.`
    );
  }
}



function setMonsterIdle() {
  monsterState = "idle";
}

function monsterAttack() {
  monsterState = "attacking";
  // Optionally, you can add logic for how long the attack animation should play before switching back to idle.
  // For example, you could use a setTimeout to call setMonsterIdle after a certain amount of time.
  setTimeout(setMonsterIdle, 1000);
}

function monsterDeath() {
  monsterState = "dead";
  setTimeout(() => monsterElement.style.display = "none", 1000);
}

function fightVilandra() {
  fighting = 0;
  goFight();
}

function fightOgrum() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

let monsterAnimationInterval;

function goFight() {
  update(locations[3]);
  console.log("Fighting index:", fighting);

  monsterHealth = monsters[fighting].health;
  console.log("Monster Health:", monsterHealth);

  monsterStats.style.display = "flex";
  monsterName.innerText = monsters[fighting].name;
  
  updateMonsterElementSize();
  monsterAnimationInterval = setInterval(animateMonster, monsterFrameInterval);
  updateMonsterHealthBar();

  console.log(monsterHealthBar.style.width);
}

function updateMonsterHealthBar() {
  monsterHealthBar.style.width = `${monsterHealth * 2}px`;
  if (monsterHealth <= 0) {
    monsterHealthBar.style.width = `0px`; // Ensure the health bar is set to 0
  }
}

// ATTACK FUNCTION

function attack() {
 
  typeText(`You attack with your ${weapons[currentWeapon].name}.`);

  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
      monsterAttack();
      typeText(`You hit the ${monsters[fighting].name}!`);
  } else {
    typeText(
      `You swing your ${weapons[currentWeapon].name}, alas, you miss...`
    );
  }
  updateMonsterHealthBar(monsterHealth);

  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
      monsterDeath();
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    typeText(`Your ${inventory.pop()} breaks... Why god, why?!.`);
    currentWeapon--;
  }
    // Monster's turn after a delay
    setTimeout(() => {
      if (monsterHealth > 0) { // Check if the monster is still alive
        typeText(`The ${monsters[fighting].name} attacks!`);
        health -= getMonsterAttackValue(monsters[fighting].level);
        updateHealth(health); // Update the player's health bar
        if (health <= 0) {
          lose();
        }
      }
    }, 3000);
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  typeText(`You dodge the ${monsters[fighting].name}'s attack. Close call!`);
}

function defeatMonster() {
  clearInterval(monsterAnimationInterval)
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  updateXP(xp);
  updateMonsterHealthBar();
  monsterDeath(); // Trigger death animation // Set the monster state to 'dead' to play the death animation
  update(locations[4]);
  monsterStats.style.display = "flex";
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["Old Stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  updateHealth(health); // Reset health bar
  updateXP(xp); // Reset XP bar
  goTown();
}

// EASTER EGG

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  typeText(`You picked ${guess}... Here are the random numbers:\n`);
  for (let i = 0; i < 10; i++) {
    typeText(`${numbers[i]} \n`);
  }
  if (numbers.includes(guess)) {
    typeText(`Right! You win 20 gold!`);
    gold += 20;
    goldText.innerText = gold;
  } else {
    typeText(`Wrong! You lose 10 health!`);
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
