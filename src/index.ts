import { directions, Game } from "./game.js";
import { keyboard } from "./keyboard.js";
import chroma from "chroma-js";
import chalk from "chalk";

// TODO: User interface for customization config
const config = {
  width: 20,
  height: 20,
  stones: 3,
};

const game = new Game(config);
let move: keyof typeof directions = "down";

const renderField = (game: Game) => {
  const field = Array.from({ length: game.config.height }, (_) =>
    Array(game.config.width).fill("  ")
  );
  const gradient = chroma
    .scale(["#89b4fa", "#a6e3a1"])
    .colors(game.snake.length);
  game.snake.forEach((c, i) => {
    let sym = " ";
    if (i === game.snake.length - 1) {
      sym = " ";
    } else if (game.snake[i + 1].x > c.x) {
      sym = " ";
    } else if (game.snake[i + 1].x < c.x) {
      sym = " ";
    } else if (game.snake[i + 1].y < c.y) {
      sym = " ";
    } else if (game.snake[i + 1].y > c.y) {
      sym = " ";
    }
    field[c.y][c.x] = chalk.hex(gradient[i]).bold(sym);
  });
  game.stones.forEach((c) => (field[c.y][c.x] = chalk.hex("#cdd6f4")(" ")));
  field[game.apple.y][game.apple.x] = chalk.hex("#eba0ac")(" ");
  const top = "╭" + "──".repeat(config.width) + "╮" + "\n";
  const bottom = "╰" + "──".repeat(config.width) + "╯" + "\n";
  return (
    top + field.map((r) => "│" + r.join("") + "│").join("\n") + "\n" + bottom
  );
};

// TODO: Decompose code
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
keyboard((k) => {
  move = KEYMAP[k as keyof typeof KEYMAP] ?? move;
});
setInterval(() => {
  try {
    game.tick(move);
  } catch {
    process.exit();
  }
  console.clear();
  console.log(renderField(game));
}, 100);
