import Phaser from "phaser";

const PIPES_VERTICAL_SPEED = -200;
const FLAPVELOCITY = 300;
const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");

    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [300, 450];

    this.config = config;
    this.bird = null;
    this.pipes = null;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.createBg();
    this.createBird();
    this.createPipes();
    this.handleInputs();
  }

  update() {
    if (this.bird.y + this.bird.height < 0) {
      this.resetGame();
    }

    if (this.bird.y > this.config.height) {
      this.resetGame();
    }

    this.recyclePipes();
  }

  createBg() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0, 0);
    this.bird.body.gravity.y = 300;
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(PIPES_VERTICAL_SPEED);
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown-SPACE", this.flap, this);
  }

  placePipe(uPipe, lPipe) {
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(
      ...this.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipeVerticalDistance
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...this.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  flap() {
    this.bird.body.velocity.y = -FLAPVELOCITY;
  }

  resetGame() {
    // alert("You lost");
    this.bird.y = this.config.startPosition.y;
    this.bird.x = this.config.startPosition.x;
    this.bird.body.velocity.y = 0;
  }

  recyclePipes() {
    const tempPipes = [];
    const that = this;

    this.pipes.getChildren().forEach(function (pipe) {
      if (pipe.getBounds().right < 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          that.placePipe(...tempPipes);
        }
      }
    });
  }
}

export default PlayScene;
