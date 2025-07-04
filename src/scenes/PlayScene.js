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

    this.pauseBtn = null;

    this.score = 0;
    this.scoreText = "";
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause", "assets/pause.png");
  }

  create() {
    this.createBg();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPauseBtn();
    this.handleInputs();
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
  }

  createBg() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setOrigin(0, 0);
    this.bird.body.gravity.y = 600;
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(PIPES_VERTICAL_SPEED);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    this.bird.setCollideWorldBounds(true);
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
      fontSize: "32px",
      fill: "#000",
    });

    this.bestScore = +localStorage.getItem("bestScore") ?? 0;
    this.bestScoreText = this.add.text(
      16,
      48,
      `Best score: ${this.bestScore}`,
      {
        fontSize: "18px",
        fill: "#000",
      }
    );
  }

  createPauseBtn() {
    this.pauseBtn = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setOrigin(1)
      .setScale(3)
      .setInteractive();
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown-SPACE", this.flap, this);

    this.pauseBtn.on("pointerdown", this.pauseTheGame, this);
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

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.score > this.bestScore) {
      this.bestScoreText.setText(`Best score: ${this.score}`);
    }
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xee4824);

    this.saveBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  saveBestScore() {
    this.bestScore = Math.max(this.score, this.bestScore);
    7;
    localStorage.setItem("bestScore", this.bestScore);
  }

  recyclePipes() {
    const tempPipes = [];
    const that = this;

    this.pipes.getChildren().forEach(function (pipe) {
      if (pipe.getBounds().right < 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          that.placePipe(...tempPipes);
          that.increaseScore();
        }
      }
    });
  }

  pauseTheGame() {
    this.physics.pause();
  }
}

export default PlayScene;
