import { directions, Game } from "./game.js";
import keyboard from "./keyboard.js";
import render from "./render.js";

// TODO: User interface for customization config
const config = {
  width: 20,
  height: 20,
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
let move: keyof typeof directions = "down";

keyboard((k) => (move = KEYMAP[k as keyof typeof KEYMAP] ?? move));
setInterval(() => {
  try {
    game.tick(move);
  } catch {
    process.exit();
  }
  render(game);
}, 100);
