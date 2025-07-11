import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);
  }

  create() {
    super.create();

    this.menu = [
      { scene: "PlayScene", text: "Play" },
      { scene: "ScoreScene", text: "Score" },
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
      menuItem.scene && this.scene.start(menuItem.scene);

      if (menuItem.text === "Exit") {
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;
