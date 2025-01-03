// game.js

//imports
import {Boundry,Pacman,Ghost,Pellet,PowerUp} from './classes.js'; //classes
import{maps,symbolMap}from './map.js';


var localName;

export async function start() {
  const name = document.getElementById('name').value;
  const welcome = document.getElementById('welcome');

  if (name.length === 0) {
    alert('Enter Username!');
    return false;
  }

  // Use localStorage to store the username
  localName =localStorage.setItem('user', name);

  welcome.style.display = 'none';
  document.getElementById('displayName').innerHTML = name;

  // Start the game after the username is successfully set
  await initializeGame();
  startTimer(); 
}

function initializeGame(){
  //let
let lastKey = ''
let score = 0;
let level = 1;
let currentMapIndex = 0;
let scaredTimeout = null;
let scaredDuration = 3000;

//Consts
const canvas = document.querySelector('canvas');
const after = document.getElementById('after');
const after2 = document.getElementById('after2');
const timer = document.getElementById("timer");
after.style.display = 'block';
after2.style.display = 'block';
timer.style.display = 'block';

// Calculate the width and height based on the map
let mapWidth = (maps[currentMapIndex].length * Boundry.width)-80;
let mapHeight = maps[currentMapIndex].length * Boundry.height;

// Set the canvas width and height
canvas.width = mapWidth;
canvas.height = mapHeight;
const c = canvas.getContext('2d')


const scoreEl = document.querySelector('#scoreEl')
const levelEl = document.querySelector('#levelEl')
const pellets = [];
const boundries = [];
const powerUps = [];
const PLAYER_SPEED = 4;


//enemy
let ghosts = [
    new Ghost({
        position:{
         x: Boundry.width * 8 + Boundry.width / 2,
         y: Boundry.height  + Boundry.height / 2
          },
        velocity:{
            x: Ghost.speed,
            y:0
        },
        c:c
    }),
    new Ghost({
      position:{
       x: Boundry.width * 8 + Boundry.width / 2,
       y: Boundry.height  + Boundry.height / 2
        },
      velocity:{
          x:Ghost.speed,
          y:0
      },
      color :'pink',
      c:c
  }),
  new Ghost({
    position:{
     x: Boundry.width * 8 + Boundry.width / 2,
     y: Boundry.height  + Boundry.height / 2
      },
    velocity:{
        x: Ghost.speed,
        y:0
    },
    color :'cyan',
    c:c
}),
new Ghost({
  position:{
   x: Boundry.width * 8 + Boundry.width / 2,
   y: Boundry.height  + Boundry.height / 2
},
  velocity:{
      x:Ghost.speed,
      y:0
  },
  color :'chartreuse',
  c:c
})
];

//player
let player = new Pacman({
    position: {
        x: Boundry.width + Boundry.width / 2,
        y: Boundry.height + Boundry.height / 2
    },
    velocity:{
        x:0,
        y:0
    },
    c: c
})

const keys = {
    w: {
        pressed : false
    },
    s: {
        pressed : false
    },
    a: {
        pressed : false
    },
    d: {
        pressed : false
    },
}



// Functions
function createImage(src){
    const image = new Image()
    image.src = src
    return image
}

function circleCollideWithBorder({circle,border}){
  const padding = Boundry.width / 2 - circle.radius - 1
    return (
    circle.position.y - circle.radius + circle.velocity.y <= border.position.y + border.height + padding &&
    circle.position.x + circle.radius + circle.velocity.x >= border.position.x -  padding &&
    circle.position.y + circle.radius + circle.velocity.y >= border.position.y -  padding &&
    circle.position.x - circle.radius + circle.velocity.x <= border.position.x + border.width +  padding
    )
}

function nextLevel(map) {

    mapWidth = maps[currentMapIndex].length * Boundry.width;
    mapHeight = maps[currentMapIndex].length * Boundry.height;
    
// Set the canvas width and height
canvas.width = mapWidth;
canvas.height = mapHeight;
    ++level


    
    // In the initializeGame function, start the timer

  // Initialize ghosts
  ghosts = [
    new Ghost({
        position:{
         x: Boundry.width * 8 + Boundry.width / 2,
         y: Boundry.height  + Boundry.height / 2
          },
        velocity:{
            x: Ghost.speed,
            y:0
        },
        c:c
    }),
    new Ghost({
      position:{
       x: Boundry.width * 8 + Boundry.width / 2,
       y: Boundry.height  + Boundry.height / 2
        },
      velocity:{
          x:Ghost.speed,
          y:0
      },
      color :'pink',
      c:c
  }),
  new Ghost({
    position:{
     x: Boundry.width * 8 + Boundry.width / 2,
     y: Boundry.height  + Boundry.height / 2
      },
    velocity:{
        x: Ghost.speed,
        y:0
    },
    color :'cyan',
    c:c
}),
new Ghost({
  position:{
   x: Boundry.width * 8 + Boundry.width / 2,
   y: Boundry.height  + Boundry.height / 2
},
  velocity:{
      x:Ghost.speed,
      y:0
  },
  color :'chartreuse',
  c:c
})
];

  player.position.x = Boundry.width + Boundry.width / 2; // Set to desired x-coordinate
  player.position.y = Boundry.height + Boundry.height / 2; // Set to desired y-coordinate

  if (map && map.length > 0) {
      // Load boundaries and objects from the map
      map.forEach((row, i) => {
          row.forEach((symbol, j) => {
              const imagePath = symbolMap[symbol];
              if (imagePath) {
                  boundries.push(new Boundry({
                      position: {
                          x: Boundry.width * j,
                          y: Boundry.height * i
                      },
                      image: createImage(imagePath),
                      c: c
                  }));
              } else if (symbol === '.') {
                  pellets.push(new Pellet({
                      position: {
                          x: j * Boundry.width + Boundry.width / 2,
                          y: i * Boundry.height + Boundry.height / 2
                      },
                      c: c
                  }));
              } else if (symbol === 'p') {
                  powerUps.push(new PowerUp({
                      position: {
                          x: j * Boundry.width + Boundry.width / 2,
                          y: i * Boundry.height + Boundry.height / 2
                      },
                      c: c
                  }));
              }
          });
      });

      // Restart animation for the new level
      animate();
      //Event listeners
window.addEventListener('keydown',({key})=>{
  console.log(key)
    switch (key){
        case 'w' :
          case 'W' :
          case 'ArrowUp' :
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 's' :
          case 'S' :
          case 'ArrowDown' :
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'a' :
          case 'A' :
          case 'ArrowLeft':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 'd' :
          case 'D' :
          case 'ArrowRight':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup',({key})=>{
  switch (key){
      case 'w' :
        case 'W' :
          case 'ArrowUp' :
          keys.w.pressed = false
          break
      case 's' :
        case 'S' :
        case 'ArrowDown' :
          keys.s.pressed = false
          break
      case 'a' :
        case 'A' :
        case 'ArrowLeft':
          keys.a.pressed = false
          break
      case 'd' :
        case 'D' :
        case 'ArrowRight' :
          keys.d.pressed = false
          break
  }
})
  } else {
      console.log('GAME OVER!');
      cancelAnimationFrame(animationId);
  }
}


let animationId

function animate(){
    levelEl.innerHTML=level;
    animationId = requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)

    

    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundries.length; i++) {
            const boundry = boundries[i];
            if (circleCollideWithBorder({
                circle: { 
                    ...player, 
                    velocity: { 
                        x: 0, 
                        y: -PLAYER_SPEED 
                    }
                },
                border: boundry
            })) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = -PLAYER_SPEED;
            }
        }
    }else if(keys.s.pressed && lastKey === 's'){
        for (let i = 0; i < boundries.length; i++) {
            const boundry = boundries[i];
            if (circleCollideWithBorder({
                circle: { 
                    ...player, 
                    velocity: { 
                        x: 0, 
                        y: PLAYER_SPEED 
                    }
                },
                border: boundry
            })) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = PLAYER_SPEED;
            }
        }
    }else if(keys.a.pressed && lastKey === 'a'){
        for (let i = 0; i < boundries.length; i++) {
            const boundry = boundries[i];
            if (circleCollideWithBorder({
                circle: { 
                    ...player, 
                    velocity: { 
                        x: -PLAYER_SPEED, 
                        y: 0 
                    }
                },
                border: boundry
            })) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = -PLAYER_SPEED;
            }
        }
    }else if(keys.d.pressed && lastKey === 'd'){
        for (let i = 0; i < boundries.length; i++) {
            const boundry = boundries[i];
            if (circleCollideWithBorder({
                circle: { 
                    ...player, 
                    velocity: { 
                        x: PLAYER_SPEED, 
                        y: 0 
                    }
                },
                border: boundry
            })) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = PLAYER_SPEED;
            }
        }
    }
    
    // detect collision between ghost and player
    for(let i = ghosts.length - 1; 0 <= i; i--){
      const ghost = ghosts[i]
      if (
        Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) < 
      ghost.radius + player.radius ){
      if (ghost.scared){
        ghosts.splice(i,1)
        score += 50;
      }else{
        clearInterval(timerInterval); // Stop the timer
            document.getElementById("seconds").innerHTML = pad(sec % 60);
            document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
            console.log('YOU LOSE!');
            cancelAnimationFrame(animationId);
      }
      
    } 
  }

  //win condition
  if (pellets.length === 0) {
    maps.splice(currentMapIndex, 1); // Remove the cleared map
    currentMapIndex = Math.min(currentMapIndex, maps.length - 1); // Ensure valid index
    if (currentMapIndex >= 0) {
      if (currentMapIndex === 0 && maps.length > 0) {
             // Clear existing game objects for the new level
      pellets.length = 0;
      boundries.length = 0;
      powerUps.length = 0;
      lastKey = ''
      ghosts = []
      cancelAnimationFrame(animationId);
        nextLevel(maps[currentMapIndex]);
    }
    } else {
        clearInterval(timerInterval); // Stop the timer
        document.getElementById("seconds").innerHTML = pad(sec % 60);
        document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
        cancelAnimationFrame(animationId)
        console.log('GAME OVER!')
    }
}

 
    //power ups go
    for(let i = powerUps.length-1; 0 <= i; i--){
      const powerUp  = powerUps[i]
      powerUp.draw()

      //player collides with power up
      if (
        Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
    ) < powerUp.radius + player.radius){
        powerUps.splice(i, 1)
        score += 20;
        ghosts.forEach(ghost => {
            ghost.speed = ghost.speed*2
          ghost.scared = true   
        })
        if (scaredTimeout) {
          clearTimeout(scaredTimeout);
        }
        scaredTimeout = setTimeout(() => {
          ghosts.forEach(ghost => {
            ghost.speed = 2
            ghost.scared = false}); // Reset scared state
        }, scaredDuration);
    }
    }

    //eat food
    for(let i = pellets.length-1; 0 <= i; i--){
            const pellet = pellets[i]
            pellet.draw()

            if (
                Math.hypot(
                pellet.position.x - player.position.x,
                pellet.position.y - player.position.y
            ) < pellet.radius + player.radius){
                pellets.splice(i, 1)
                score += 10
                scoreEl.innerHTML=score;
            }
    }        
           


    boundries.forEach((boundry) => {
        boundry.draw()
        if(circleCollideWithBorder({
            circle: player,
            border: boundry
        }) ){
            player.velocity.y = 0
            player.velocity.x = 0
        }
    })
    
    player.update()
   
    ghosts.forEach(ghost => {
    ghost.update()

    const collisions = [];
    boundries.forEach(boundry=>{
      //right  
      if (
          !collisions.includes('right') &&
          circleCollideWithBorder({
            circle: { 
                ...ghost, 
                velocity: { 
                    x: ghost.speed, 
                    y: 0 
                }
            },
            border: boundry
        })
      ) {
            collisions.push('right')
        }

        //left
        if (
          !collisions.includes('left') &&
          circleCollideWithBorder({
            circle: { 
                ...ghost, 
                velocity: { 
                    x: -ghost.speed, 
                    y: 0 
                }
            },
            border: boundry
        })) {
            collisions.push('left')
        }

        //up
        if (
          !collisions.includes('up') &&
          circleCollideWithBorder({
            circle: { 
                ...ghost, 
                velocity: { 
                    x: 0, 
                    y: -ghost.speed
                }
            },
            border: boundry
        })) {
            collisions.push('up')
        }

        //down
        if (
          !collisions.includes('down') &&
          circleCollideWithBorder({
            circle: { 
                ...ghost, 
                velocity: { 
                    x: 0, 
                    y: ghost.speed
                }
            },
            border: boundry
        })) {
            collisions.push('down')
          }
    });
    if(collisions.length > ghost.prevCollisions.length)
      ghost.prevCollisions = collisions
    
    if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)){

      if (ghost.velocity.x > 0)
        ghost.prevCollisions.push('right')
      else if (ghost.velocity.x < 0)
        ghost.prevCollisions.push('left')
      else if (ghost.velocity.y < 0)
        ghost.prevCollisions.push('up')
      else if (ghost.velocity.y > 0)
        ghost.prevCollisions.push('down')
      

      const pathways = ghost.prevCollisions.filter(collision => {
        return !collisions.includes(collision)
      })

      const direction = pathways[Math.floor(Math.random() * pathways.length)];

      switch (direction) {
        case 'down':
          ghost.velocity.y = ghost.speed
          ghost.velocity.x = 0
          break
        case 'up':
          ghost.velocity.y = -ghost.speed
          ghost.velocity.x = 0
          break
        case 'right':          
          ghost.velocity.y = 0
          ghost.velocity.x = ghost.speed
          break
        case 'left':
          ghost.velocity.y = 0
          ghost.velocity.x = -ghost.speed
          break
      }

      ghost.prevCollisions = [];

    }
   
   }) 
    
}

const initialMap = maps[currentMapIndex];
initialMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        const imagePath = symbolMap[symbol];
        if (imagePath) {
            boundries.push(new Boundry({
                position: {
                    x: Boundry.width * j,
                    y: Boundry.height * i
                },
                image: createImage(imagePath),
                c: c
            }));
        } else if (symbol === '.') {
            pellets.push(new Pellet({
                position: {
                    x: j * Boundry.width + Boundry.width / 2,
                    y: i * Boundry.height + Boundry.height / 2
                },
                c: c
            }));
        } else if (symbol === 'p') {
            powerUps.push(new PowerUp({
                position: {
                    x: j * Boundry.width + Boundry.width / 2,
                    y: i * Boundry.height + Boundry.height / 2
                },
                c: c
            }));
        }
    });
});


   // Start the animation
   animate(); 


    
   // Set up event listeners for key presses
   window.addEventListener('keydown', ({ key }) => {
       console.log(key);
       switch (key) {
           case 'w':
           case 'W':
           case 'ArrowUp':
               keys.w.pressed = true;
               lastKey = 'w';
               break;
           case 's':
           case 'S':
           case 'ArrowDown':
               keys.s.pressed = true;
               lastKey = 's';
               break;
           case 'a':
           case 'A':
           case 'ArrowLeft':
               keys.a.pressed = true;
               lastKey = 'a';
               break;
           case 'd':
           case 'D':
           case 'ArrowRight':
               keys.d.pressed = true;
               lastKey = 'd';
               break;
       }
   });
   
   window.addEventListener('keyup', ({ key }) => {
       switch (key) {
           case 'w':
           case 'W':
           case 'ArrowUp':
               keys.w.pressed = false;
               break;
           case 's':
           case 'S':
           case 'ArrowDown':
               keys.s.pressed = false;
               break;
           case 'a':
           case 'A':
           case 'ArrowLeft':
               keys.a.pressed = false;
               break;
           case 'd':
           case 'D':
           case 'ArrowRight':
               keys.d.pressed = false;
               break;
       }
   });
}

var sec = 0;
var timerInterval; // Declare timerInterval in a broader scope

function pad(val) {
    return val > 9 ? val : "0" + val;
}

function startTimer() {
    timerInterval = setInterval(function() {
        document.getElementById("seconds").innerHTML = pad(++sec % 60);
        document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
    }, 1000);
}


window.start = start;