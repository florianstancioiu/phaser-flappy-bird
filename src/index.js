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
      // gravity: { y: 300 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const VELOCITY = 200;
const PIPES_TO_RENDER = 4;
const PIPES_HORIZONTAL_DISTANCE = 300;
const PIPES_VERTICAL_SPEED = -200;
const FLAPVELOCITY = 300;
const initialBirdPosition = {
  x: (1 / 10) * config.width,
  y: config.height / 2,
};
let bird = null;
let upperPipe = null;
let lowerPipe = null;
const pipeVerticalDistanceRange = [150, 250];

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  this.add.image(config.width / 2, config.height / 2, "sky");
  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0, 0);
  bird.body.gravity.y = 300;

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    let pipeVerticalDistance = Phaser.Math.Between(
      ...pipeVerticalDistanceRange
    );
    let pipeVerticalPosition = Phaser.Math.Between(
      20,
      config.height - 20 - pipeVerticalDistance
    );

    upperPipe = this.physics.add
      .sprite(PIPES_HORIZONTAL_DISTANCE * (i + 1), pipeVerticalPosition, "pipe")
      .setOrigin(0, 1);
    lowerPipe = this.physics.add
      .sprite(
        PIPES_HORIZONTAL_DISTANCE * (i + 1),
        upperPipe.y + pipeVerticalDistance,
        "pipe"
      )
      .setOrigin(0, 0);

    upperPipe.body.velocity.x = PIPES_VERTICAL_SPEED;
    lowerPipe.body.velocity.x = PIPES_VERTICAL_SPEED;
  }

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
