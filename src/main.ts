import kaplay from "kaplay";

const player_speed = 1000;
let level_count = 0;

const k = kaplay({
    width: window.innerWidth,
    height: window.innerHeight,
    background: [0, 0, 256],
});


let spawnTime = [1.0, 0.5, 0.1];
let speed = [300, 400, 600];

// Spawn a seagull endlessly
k.loop(0.1, () => {

    // Pick a random row number between 0 and 5
    const randomPixel = k.randi(0, window.innerHeight);

    // Add the seagull to the game world
    k.add([
        k.sprite("seagull", { anim: "fly" }),
        k.pos(window.innerWidth, randomPixel),
        k.area(),
        k.move(k.LEFT, speed[level_count]), // Moves left across the screen
        "seagull"
    ]);
});

//Import all sprites into sprite lib ONLY ONCE
k.loadSprite("greenlight", "/assets/Greenlight.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
        "darken": {
            from: 0,
            to: 7,
            speed: 3,
            loop: false
        }
    }
});
k.loadSprite("seagull", "/assets/pigeons.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
        "fly": {
            from: 0,
            to: 1,
            speed: 3,
            loop: true
        }
    }
});
k.loadSprite("player", "/assets/gatsby.png", {
    sliceX: 10,
    sliceY: 1,
    anims: {
        "death": {
            from: 1,
            to: 9,
            speed: 3,
            loop: false
        }
    }
});

//Static player object, DO NOT CHANGE, no start animation
const player = k.add([
    k.sprite("player"),
    k.pos(0),
    k.area(),
    "player_gatsby"
]);


//Movement keys WASD (extend later)
k.onKeyDown("w", () => {
    player.move(0, -player_speed);
})

k.onKeyDown("s", () => {
    player.move(0, player_speed);
})

k.onKeyDown("d", () => {
    player.move(player_speed, 0);
})

k.onKeyDown("a", () => {
    player.move(-player_speed, 0);
})

//Death scene
k.scene("Death", () => {
    k.add([
        k.sprite("player", {anim: "death"}),
        k.pos(((window.innerWidth - 32) / 2), ((window.innerHeight - 32) / 2))
        ]);
    console.log("Dead!");


})

//Win Scene (Win condition, level_count == 5) Happens only once
k.scene("Win", () => {
    k.add([
        k.sprite("greenlight", {anim: "darken"}),
        k.pos((window.innerWidth - 32) / 2, (window.innerHeight - 32)/ 2)
    ])
})


//Death condition (Maybe three lives)
k.onCollide("player_gatsby", "seagull", (_p, e) => {
    k.destroy(e);
    k.go("Death");
})


//regular code for decision-making.
function animate() {
    //Loop
    window.requestAnimationFrame(animate);

    //Level up
    if(player.pos.y < 0) {
        player.pos.y = window.innerHeight;
        level_count++;
        console.log(spawnTime[level_count]);
    } else if (player.pos.y + 32 > window.innerHeight) { //So players cannot hide under game window
        player.pos.y = window.innerHeight - 32;
    }

    if (player.pos.x < 0) {
        player.pos.x = 0;
    } else if(player.pos.x + 32 > window.innerWidth) {
        player.pos.x = window.innerWidth - 32;
    }

    if (level_count == 5) {
        k.go("Win");
        console.log("You Won! Or did you?...");
        level_count++;
    }

}



animate();
