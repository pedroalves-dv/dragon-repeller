// const frameCount = 4; // Number of frames in the animation
// let currentFrame = 0; // Current frame index
// const frameInterval = 400; // Milliseconds per frame, adjust for speed


// const PlayeridleFrames = [];
// for (let i = 1; i <= frameCount; i++) {
//   const img = new Image();
//   img.src = `assets/Sprites/Player/idle/idle-export${i}.png`;
//   PlayeridleFrames.push(img.src);
// }

// // Animation function
// function animatePlayer() {
//   playerElement.style.backgroundImage = `url('${PlayeridleFrames[currentFrame]}')`;
//   playerElement.style.backgroundSize = 'cover'; // Ensure image scales within box
//   // make the player bigger
//   playerElement.style.width = '100px';
//   playerElement.style.height = '100px';
//   playerElement.style.backgroundPosition = 'center -20px'; // Center image
//   playerElement.style.backgroundRepeat = 'no-repeat'; // Prevent repeat
//   currentFrame = (currentFrame + 1) % frameCount;
// }

// // Animate player
// setInterval(animatePlayer, frameInterval);



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


const monsters = [
  {
    name: "One-eyed Vilandra",
    level: 2,
    health: 35,
    frameInterval: 500,
    idleFrames: Array.from({ length: 8 }, (_, i) => `assets/Sprites/flying-eye-demon/flying-eye-demon${i + 1}.png`),
    attackFrames: Array.from({ length: 3 }, (_, i) => `assets/Sprites/Hit/hit${i + 1}.png`),
    deathFrames: Array.from({ length: 8 }, (_, i) => `assets/Sprites/EnemyDeath/enemy-death${i + 1}.png`),
    idleFrameCount: 8,    // Frame count for idle animation
    attackFrameCount: 3,  // Frame count for attack animation
    deathFrameCount: 8    // Frame count for death animation
  },
  {
    name: "Ogrum the Fanged Beast",
    level: 8,
    health: 90,
    frameInterval: 500,
    idleFrames: Array.from({ length: 4 }, (_, i) => `assets/Sprites/Ogre/Idle/ogre-idle${i + 1}.png`),
    attackFrames: Array.from({ length: 7 }, (_, i) => `assets/Sprites/Hit/hit${i + 1}.png`),
    deathFrames: Array.from({ length: 8 }, (_, i) => `assets/Sprites/EnemyDeath/enemy-death${i + 1}.png`),
    idleFrameCount: 4,    // Frame count for idle animation
    attackFrameCount: 7,  // Frame count for attack animation
    deathFrameCount: 8    // Frame count for death animation
    
  },
  {
    name: "Apex Wyrm",
    level: 20,
    health: 320,
    frameInterval: 500,
    idleFrames: Array.from({ length: 6 }, (_, i) => `assets/Sprites/Grotto-escape-2-boss-dragon/sprites/idle/dragon${i + 1}.png`),
    attackFrames: Array.from({ length: 7 }, (_, i) => `assets/Sprites/Hit/hit${i + 1}.png`),
    deathFrames: Array.from({ length: 8 }, (_, i) => `assets/Sprites/EnemyDeath/enemy-death${i + 1}.png`),
    idleFrameCount: 6,    // Frame count for idle animation
    attackFrameCount: 7,  // Frame count for attack animation
    deathFrameCount: 8    // Frame count for death animation
  },
];



