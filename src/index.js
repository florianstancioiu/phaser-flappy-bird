import "./style.css";

import Phaser, { UP } from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";

const WIDTH = 400;
const HEIGHT = 600;
const BIRD_POSITION = {
  x: WIDTH * 0.1,
  y: HEIGHT / 2,
};
const PIPES_TO_RENDER = 4;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
  pipesToRender: PIPES_TO_RENDER,
};

const scenes = [PreloadScene, ScoreScene, MenuScene, PlayScene, PauseScene];
const createScene = (Scene) => new Scene(SHARED_CONFIG);
const initScenes = () => scenes.map(createScene);

const config = {
  type: Phaser.AUTO,
  width: SHARED_CONFIG.width,
  height: SHARED_CONFIG.height,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      // gravity: { y: 300 },
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
