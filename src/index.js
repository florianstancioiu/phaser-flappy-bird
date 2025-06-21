import "./style.css";

import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 300 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const VELOCITY = 200;
const FLAPVELOCITY = 300;
const initialBirdPosition = {
  x: (1 / 10) * config.width,
  y: config.height / 2,
};
let bird = null;
let totalDelta = null;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
}

function create() {
  this.add.image(config.width / 2, config.height / 2, "sky");
  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0, 0);

  this.input.on("pointerdown", flap);
  this.input.keyboard.on("keydown-SPACE", flap);
}

function update(time, delta) {
  if (bird.y + bird.height < 0) {
    resetGame();
  }

  if (bird.y > config.height) {
    resetGame();
  }
}

function resetGame() {
  alert("You lost");
  bird.y = initialBirdPosition.y;
  bird.x = initialBirdPosition.x;
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -FLAPVELOCITY;
}

new Phaser.Game(config);
