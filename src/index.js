import "./style.css";

import Phaser, { UP } from "phaser";

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
const PIPES_VERTICAL_SPEED = -200;
const FLAPVELOCITY = 300;
const initialBirdPosition = {
  x: (1 / 10) * config.width,
  y: config.height / 2,
};
const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [300, 450];
let pipeHorizontalDistance = 300;
let bird = null;
let pipes = null;

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

  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(PIPES_VERTICAL_SPEED);

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

  recyclePipes();
}

function placePipe(uPipe, lPipe) {
  const rightMostX = getRightMostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(
    ...pipeVerticalDistanceRange
  );
  const pipeVerticalPosition = Phaser.Math.Between(
    20,
    config.height - 20 - pipeVerticalDistance
  );
  const pipeHorizontalDistance = Phaser.Math.Between(
    ...pipeHorizontalDistanceRange
  );

  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
}

function recyclePipes() {
  const tempPipes = [];
  pipes.getChildren().forEach(function (pipe) {
    if (pipe.getBounds().right < 0) {
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  });
}

function getRightMostPipe() {
  let rightMostX = 0;

  pipes.getChildren().forEach(function (pipe) {
    rightMostX = Math.max(pipe.x, rightMostX);
  });

  return rightMostX;
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
