import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {
  constructor(config) {
    super("PauseScene", config);
  }

  create() {
    super.create();

    this.menu = [
      { scene: "PlayScene", text: "Continue" },
      { scene: "MenuScene", text: "Exit" },
    ];

    super.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textGO = menuItem.textGO;

    textGO.setInteractive({ cursor: "pointer" });

    textGO.on("pointerover", () => {
      textGO.setStyle({
        fill: "#ff0",
      });
    });

    textGO.on("pointerout", () => {
      textGO.setStyle({
        fill: "#fff",
      });
    });

    textGO.on("pointerup", () => {
      if (menuItem.scene && menuItem.text === "Continue") {
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        this.scene.stop("PlayScene");
        this.scene.start("MenuScene");
      }
    });
  }
}

export default PauseScene;
