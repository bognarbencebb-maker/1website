

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");



const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;


const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 900;


// Load images
const background = new Image();
background.src = "background.png";


const playerImg = new Image();
playerImg.src = "character1.png";
const PLAYER_WIDTH = 256;
const PLAYER_HEIGHT = 256;


// Player
let player = { x: WORLD_WIDTH/2 - PLAYER_WIDTH/2, y: 200, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, vy: 0 };


// Camera
let cameraX = player.x - SCREEN_WIDTH/2;
let cameraY = 0;
const CAMERA_MARGIN = SCREEN_WIDTH/3;


// Movement
const speed = 20;
const gravity = 0.5;
const groundY = 660;


// Input
let keys = {};
window.addEventListener("keydown", (e) => keys[e.code] = true);
window.addEventListener("keyup", (e) => keys[e.code] = false);


function update() {
// Horizontal movement
if(keys["KeyA"]) player.x -= speed;
if(keys["KeyD"]) player.x += speed;


// World boundaries
player.x = Math.max(0, Math.min(player.x, WORLD_WIDTH - player.width));


// Jump
if(keys["Space"] && player.y + player.height >= groundY) player.vy = -15;
window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (e.code === "Space") {
        e.preventDefault(); // Megakadályozza az oldal görgetését
    }
});
window.addEventListener("keyup", (e) => keys[e.code] = false);


// Gravity
player.vy += gravity;
player.y += player.vy;


// Ground collision
if(player.y + player.height >= groundY) {
player.y = groundY - player.height;
player.vy = 0;
}


// Camera follow
if(player.x - cameraX > SCREEN_WIDTH - CAMERA_MARGIN) cameraX = player.x - (SCREEN_WIDTH - CAMERA_MARGIN);
else if(player.x - cameraX < CAMERA_MARGIN) cameraX = player.x - CAMERA_MARGIN;


// Camera boundaries
cameraX = Math.max(0, Math.min(cameraX, WORLD_WIDTH - SCREEN_WIDTH));
}

function draw() {
    // Háttér kirajzolása
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.drawImage(background, -cameraX, -cameraY, WORLD_WIDTH, WORLD_HEIGHT);

    // Karakter kirajzolása
    ctx.drawImage(
        playerImg,
        player.x - cameraX,
        player.y - cameraY,
        player.width,
        player.height
    );
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Csak akkor induljon el, ha mindkét kép betöltődött
let imagesLoaded = 0;
background.onload = function() {
    imagesLoaded++;
    if (imagesLoaded === 2) gameLoop();
};
playerImg.onload = function() {
    imagesLoaded++;
    if (imagesLoaded === 2) gameLoop();
};
