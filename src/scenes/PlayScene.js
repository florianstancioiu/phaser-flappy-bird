import BaseScene from "./BaseScene";

const PIPES_VERTICAL_SPEED = -200;
const FLAPVELOCITY = 300;
const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);

    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [300, 450];

    this.bird = null;
    this.pipes = null;

    this.pauseBtn = null;
    this.isPaused = false;

    this.score = 0;
    this.scoreText = "";

    this.blockIncreaseScore = false;
  }

  create() {
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPauseBtn();
    this.handleInputs();
    this.handleEvents();
  }

  handleEvents() {
    if (this.pauseEvent) {
      return;
    }

    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(
          this.screenCenter.x,
          this.screenCenter.y,
          `Fly in: ${this.initialTime}`,
          this.fontOptions
        )
        .setOrigin(0.5, 1);

      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText(`Fly in: ${this.initialTime}`);

    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();

    // set the back btn on top of the pipes
    this.children.bringToTop(this.backBtn);
  }

  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
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
    this.isPaused = false;
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

    this.blockIncreaseScore = false;
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  flap() {
    if (this.isPaused) {
      return;
    }

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
        this.scene.start("MenuScene");
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
    const allPipes = this.pipes.getChildren();

    allPipes.forEach((pipe) => {
      if (pipe.getBounds().right < 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
        }
      }
    });

    const firstPipeRightBound = Math.min(
      ...allPipes.map((pipe) => pipe.getBounds().right)
    );

    if (
      firstPipeRightBound < this.bird.getBounds().left &&
      this.blockIncreaseScore === false
    ) {
      this.increaseScore();
      this.blockIncreaseScore = true;
    }
  }

  pauseTheGame() {
    this.isPaused = true;
    this.physics.pause();
    this.scene.pause();
    this.scene.launch("PauseScene");
  }
}

export default PlayScene;
