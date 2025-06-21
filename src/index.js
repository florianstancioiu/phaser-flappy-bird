import "./style.css";

import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

new Phaser.Game(config);

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
}

let bird = null;
let totalDelta = null;

function create() {
  this.add.image(config.width / 2, config.height / 2, "sky");
  //debugger;
  bird = this.physics.add
    .sprite((1 / 10) * config.width, config.height / 2, "bird")
    .setOrigin(0, 0);
  // bird.body.gravity.y = 200;
  // console.log(bird);
}

// 60fps
// 60 times per second
function update(time, delta) {
  // console.log(bird.body.velocity.y);
  // console.log(delta);
  totalDelta += delta;

  if (totalDelta < 1000) {
    return;
  }

  console.log(bird.body.velocity.y);
  totalDelta = 0;
}
