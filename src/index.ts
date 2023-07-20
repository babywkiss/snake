import { Game } from "./game.js";
import keyboard from "./keyboard.js";
import render from "./render.js";
import { Config, Direction } from "./types.js";

// TODO: User interface for customization config
const config: Config = {
  fieldSize: {
    width: 20,
    height: 20,
  },
  stones: 3,
};

const KEYMAP = {
  j: "down",
  k: "up",
  h: "left",
  l: "right",
  s: "down",
  w: "up",
  a: "left",
  d: "right",
} as const;

const game = new Game(config);
let move: Direction = "down";

keyboard((k) => (move = KEYMAP[k as keyof typeof KEYMAP] ?? move));
const start = Date.now();
setInterval(() => {
  try {
    game.tick(move);
  } catch {
    process.exit();
  }
  render(game, Math.floor((Date.now() - start) / 1000).toString());
}, 100);
