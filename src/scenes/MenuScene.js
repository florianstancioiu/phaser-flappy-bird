import Phaser from "phaser";

class MenuScene extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
  }

  create() {
    this.createBg();
  }

  createBg() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }
}

export default MenuScene;
