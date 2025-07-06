import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.fontSize = 34;
    this.lineHeight = 64;
    this.fontOptions = {
      fontSize: `${this.fontSize}px`,
      fill: "#fff",
    };
    this.screenCenter = {
      x: config.width / 2,
      y: config.height / 2,
    };
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);

    this.createBackBtn();
  }

  createBackBtn() {
    if (this.config.canGoBack) {
      this.backBtn = this.add
        .image(this.config.width - 40, 40, "back")
        .setScale(2)
        .setInteractive({ cursor: "pointer" });

      this.backBtn.on("pointerup", () => {
        this.scene.start("MenuScene");
      });
    }
  }

  createMenu(menu, setupMenuEvents) {
    let lastMenuPositionY = 0;

    menu.forEach((menuItem) => {
      const menuPosition = this.screenCenter;
      menuItem.textGO = this.add
        .text(
          menuPosition.x,
          menuPosition.y + lastMenuPositionY - 60,
          menuItem.text,
          this.fontOptions
        )
        .setOrigin(0.5, 1);

      lastMenuPositionY += 60;

      setupMenuEvents(menuItem);
    });
  }
}

export default BaseScene;
