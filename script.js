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
const monsterHealthText = document.querySelector("#monsterHealth");

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

updateHealth(health);
updateXP(xp);

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

function updateXP(xp) {
  xpBar.style.width = `${xp}%`;
}

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60,
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
  },
];
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a decrepit sign that says "Store".',
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
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "It's pitch black, adn wet... You see something approaching.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You died. &#x2620;",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You've defeated the dragon! YOU WIN THE GAME! &#x1F389;",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret numericron. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, it might open!",
  },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Type text with fade-in effect
function typeText(text, speed = 40) {
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

document.addEventListener("DOMContentLoaded", () => {
  const initialText =
    "The cold wind rises. And with it, the boiling fires of the deep. No soul dares to dwell in the open.\nFor the world was taken, and belonged to man no more.\nYou are in the town square. Where do you want to go?";
  typeText(initialText);
});

// Update the game state
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;

  typeText(location.text); // Use the typewriter effect for updating the text
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
    typeText("You bought 10 health!");
  } else {
    typeText("You do not have enough gold to buy health... Oh, The humanity!");
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
      typeText(
        `You now have a ${newWeapon}! Such power!\nIn your inventory you have: ${inventory}`
      );
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

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  typeText(`The ${monsters[fighting].name} attacks!`);
  typeText(`You attack with your ${weapons[currentWeapon].name}.`);
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    typeText(
      `You swing your ${weapons[currentWeapon].name}, alas, you miss...`
    );
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
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
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  updateXP(xp); // Update XP bar visually
  update(locations[4]);
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
    text.innerText += typeText(`${numbers[i]} \n`);
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
