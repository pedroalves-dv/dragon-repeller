const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const enterTownButton = document.getElementById("button0");

const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const maxXpBar = document.querySelector(".max-xp");
const xpBar = document.getElementById("xpBar");
const healthText = document.querySelector("#healthText");
const maxHealthBar = document.querySelector(".max-health");
const healthBar = document.getElementById("healthBar");
const goldText = document.querySelector("#goldText");

const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");

const monsterMaxHealthBar = document.querySelector(".monster-max-health");
const monsterHealthBar = document.querySelector(".monster-health");

const monsterElement = document.getElementById("monsterElement");
const monsterElementContainer = document.getElementById("monsterElementContainer");

const playerElement = document.getElementById("player");

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
let maxXp = 100;
let health = 100;
let maxHealth = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let monsterMaxHealth;
let inventory = ["Old Stick"];

const monsters = [
  {
    name: "One-eyed Vilandra",
    level: 2,
    health: 25,
  },
  {
    name: "Ogrum the Fanged Beast",
    level: 8,
    health: 90,
  },
  {
    name: "Apex Wyrm",
    level: 20,
    health: 250,
  },
];

const monsterState = {
  IDLE: "idle",
  ATTACK: "attack",
  HIT: "hit",
  DEATH: "death"
};

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
  healthBar.style.width = `${health}px`;
  maxHealthBar.style.width = `${maxHealth}px`;
}
updateHealth(health);

function updateXP(xp) {
  xpBar.style.width = `${xp}px`;
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
    "button functions": [attack, dodgeGame, goTown],
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
  {
    name: "start",
    "button text": ["Enter Town"],
    "button functions": [goTown],
    text: "The cold wind rises. And with it, the boiling fires of the deep. No soul dares dwell in the open.\nFor the world was taken, and belonged to man no more.\n\nYet, some lights still flicker...",
  }
];

function getLocationText(location) {
  let text = location.text;
  if (typeof fighting !== 'undefined' && fighting >= 0 && fighting < monsters.length) {
    text = text.replace("{monsterName}", monsters[fighting].name);
  }
  return text;
}

// Type text with fade-in effect
function typeText(text, speed = 25) {
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
  } else if (location === locations[9]){
    button1.classList.add("hidden");
    button2.classList.add("hidden");
    button3.classList.add("hidden");

    enterTownButton.classList.remove("hidden"); 
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
    maxHealth = Math.min(health + 10, 200);
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

let currentMonster = monsters[fighting];
let currentMonsterState = "idle";

// Function to change the monster with specific state
function changeMonster(monster, state) {
  if (!monster) {
    console.error("newMonster is undefined"); // Debugging: Log an error if newMonster is undefined
    return;
  }
  // Remove all previous classes to reset the state
  monsterElement.className = ""; // Clear all classes
  
  // Define the base class for the monster based on its name
  const monsterClass = monster.name.toLowerCase().replace(/ /g, '-');
  
  // Define the full class for the monster's current state
  const stateClass = `${monsterClass}-${state}`;
  
  // Apply both the monster's base class and the state class
  monsterElement.classList.add(stateClass);

  // Track the current state (optional for further logic)
  currentMonsterState = state;
  console.log("Monster Element:", monsterElement.className);
}

// Sets monster to 'idle' after animations end
function setMonsterStateIdleAfterDelay(delay) {
  setTimeout(() => {
    if (monsterHealth > 0) { // Ensure the monster is still alive
      changeMonster(currentMonster, 'idle');
    }
  }, delay);
}

// Function for monster to attack with animation
function monsterAttack() {
  // change to attack animation
  changeMonster(currentMonster, 'attack'); 
  typeText("The " + monsters[fighting].name + " attacks.");
  // aplly damage to player
  health -= getMonsterAttackValue(monsters[fighting].level)
  updateHealth(health);

  const dodgeChance = Math.floor(Math.random() * 100);
  // check if monster hits player
  if(dodgeChance <= 25) {
    dodgeGame();
  }; 

    if (health <= 0) {
    lose(); 
  } 
  
}


function fightVilandra() {
  fighting = 0;
  currentMonster = monsters[fighting]; // Set the current monster
  goFight();
}

function fightOgrum() {
  fighting = 1;
  currentMonster = monsters[fighting]; // Set the current monster
  goFight();
}

function fightDragon() {
  fighting = 2;
  currentMonster = monsters[fighting]; // Set the current monster
  goFight();
}

// FIGHT
function goFight() {
  update(locations[3]);
  changeMonster(currentMonster, currentMonsterState);
  console.log("Current Monster:", currentMonster, "Fighting index:", fighting);

  monsterHealth = monsters[fighting].health;
  console.log("Monster Health:", monsterHealth);

  monsterStats.style.display = "flex";
  monsterName.innerText = monsters[fighting].name;
  
  updateMonsterHealthBar();
  console.log(monsterHealthBar.style.width);
}

function updateMonsterHealthBar() {
  monsterMaxHealthBar.style.width = `${monsters[fighting].health}px`;
  monsterHealthBar.style.width = `${monsterHealth}px`;
  if (monsterHealth <= 0) {
    monsterHealthBar.style.width = `0px`; // Ensure the health bar is set to 0
  }
}


function attack() {
 
  typeText(`You attack with your ${weapons[currentWeapon].name}.`);

  if (isMonsterHit()) {
      monsterHealth -=
        weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
      changeMonster(currentMonster, 'hit'); // Show monster hit reaction
      typeText(`You hit the ${monsters[fighting].name}!`);
      setMonsterStateIdleAfterDelay(300)
      // monsterAttack();
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
    updateInventoryDisplay();
  }
    // Monster's turn after a delay
    setTimeout(() => {
      if (monsterHealth > 0) { // Check if the monster is still alive
        monsterAttack();
      }
    }, 1000);
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}


// ======================== DODGE GAME ========================
function dodgeGame() {
  typeText("The monster hesitates... Prepare to dodge!");

  // Show Dodge button and temporarily disable other buttons
  button1.innerText = "Dodge!";
  button1.style.backgroundColor = "red"; // Start with noticeable color
  button2.classList.add("hidden");
  button3.classList.add("hidden");

  // Start the dodge timer (button changes color back and forth for 2 seconds)
  const dodgeTime = 2000; // 2 seconds
  let dodgeSuccess = false;

  const dodgeHandler = () => {
    dodgeSuccess = true;
    clearTimeout(dodgeTimeout);
    button1.removeEventListener("click", dodgeHandler);
    dodgeSuccessAction();
  };

  // Listen for dodge button click to succeed
  button1.addEventListener("click", dodgeHandler);

  // Change color back and forth, then end the dodge game
  let dodgeTimeout = setTimeout(() => {
    // Reset the button to its original state
    resetDodgeGame(dodgeSuccess);
  }, dodgeTime);

  // Toggle button color for dodge effect
  let toggleColor = true;
  const colorInterval = setInterval(() => {
    button1.style.backgroundColor = toggleColor ? "green" : "red";
    toggleColor = !toggleColor;
  }, 200); // Change color every 200ms

  // Stop color toggling once dodge game ends
  setTimeout(() => clearInterval(colorInterval), dodgeTime);
}

// Dodge success action
function dodgeSuccessAction() {
  typeText("You successfully dodged the attack!");
  resetDodgeGame(true);
}

// Reset the dodge game state
function resetDodgeGame(success) {
  button1.removeEventListener("click", dodgeHandler);
  button1.innerText = "Attack";
  button1.style.backgroundColor = ""; // Reset to original color
  button2.classList.remove("hidden");
  button3.classList.remove("hidden");

  if (!success) {
    // If dodge failed, deal random damage
    const failDamage = Math.floor(Math.random() * 20) + 5; // Example random damage range
    health -= failDamage;
    typeText(`You failed to dodge! The monster hits you for ${failDamage} damage.`);
    updateHealth(health);

    if (health <= 0) {
      lose();
    }
  }
}

// Function to set monster's death state
function monsterDeath() {
  // change to death animation
  changeMonster(currentMonster, 'death');
  setTimeout(() => {
    // Ensure the death animation has time to complete
    console.log("Monster has died.");
  }, 2000);
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  // xp += monsters[fighting].level;
  xp += Math.min(monsters[fighting].level, 100);
  maxXp += Math.min(monsters[fighting].level, 100);
  goldText.innerText = gold;
  updateXP(xp);
  updateMonsterHealthBar(monsterHealth);
  
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
  updateHealth(health); // Reset health bar
  updateXP(xp); // Reset XP bar
  updateInventoryDisplay();
  replay();
}

function replay() {
  location.reload();
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
