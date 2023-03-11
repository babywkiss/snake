import { directions, Game } from "./game.js";
import { keyboard } from "./keyboard.js";
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
    Array(game.config.width).fill(chalk.bgGray("  "))
  );
  game.snake.forEach((c) => (field[c.y][c.x] = chalk.bgGreen("  ")));
  game.stones.forEach((c) => (field[c.y][c.x] = "  "));
  field[game.apple.y][game.apple.x] = chalk.bgRed("  ");
  return field.map((r) => r.join("")).join("\n");
};

// TODO: Decompose code
const KEYMAP = {
  j: "down",
  k: "up",
  h: "left",
  l: "right",
} as const;
keyboard((k) => {
  move = KEYMAP[k as keyof typeof KEYMAP] ?? move;
});
setInterval(() => {
  console.clear();
  game.tick(move);
  console.log(renderField(game));
}, 100);
