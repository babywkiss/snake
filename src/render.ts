import Game from "./game.js";
import chroma from "chroma-js";
import chalk, { ChalkInstance } from "chalk";

const createField = (game: Game) =>
  Array.from({ length: game.config.fieldSize.height }, (_) =>
    Array(game.config.fieldSize.width).fill("  "),
  );

// TODO: Refactor this trash :)
export const render = (game: Game, secondsPassed: string) => {
  console.clear();
  const field = createField(game);
  const snake = game.snake;
  const gradient = chroma.scale(["#89b4fa", "#a6e3a1"]).colors(snake.length);
  snake.forEach((c, i) => {
    let sym = " ";
    if (i === game.snake.length - 1) {
      if (game.lastMove === "down") sym = " ";
      if (game.lastMove === "up") sym = " ";
      if (game.lastMove === "left") sym = " ";
      if (game.lastMove === "right") sym = " ";
    } else {
      if (i === 0) {
        if (snake[i + 1].x !== c.x) sym = " ";
        if (snake[i + 1].y !== c.y) sym = " ";
      } else {
        if (snake[i + 1].x > c.x) sym = " ";
        if (snake[i + 1].x < c.x) sym = " ";
        if (snake[i + 1].y < c.y) sym = " ";
        if (snake[i + 1].y > c.y) sym = " ";
        if (
          (snake[i + 1].x !== c.x && snake[i - 1].y !== c.y) ||
          (snake[i + 1].y !== c.y && snake[i - 1].x !== c.x)
        ) {
          sym = " ";
        }
      }
    }
    field[c.y][c.x] = chalk.hex(gradient[i])(sym);
  });
  game.stones.forEach((c) => (field[c.y][c.x] = " "));
  field[game.apple.y][game.apple.x] = chalk.red(" ");
  const fieldSize = game.config.fieldSize;
  const top = "╭" + "──".repeat(fieldSize.width) + "╮" + "\n";
  const bottom = "╰" + "──".repeat(fieldSize.width) + "╯";
  // status bar
  const segments = [
    [`ﱖ ${fieldSize.width}x${fieldSize.height}  `, chalk.gray],
    [`龍${10}  `, chalk.gray],
    [` ${secondsPassed}  `, chalk.blue],
    [` ${game.snake.length - 3}  `, chalk.red],
  ];
  const effectiveLength = segments.map((s) => s[0]).join("").length;
  const padding = Math.floor((fieldSize.width * 2 - effectiveLength) / 2);
  const fixer = effectiveLength + padding * 2 - fieldSize.width * 2 + 1;
  const message =
    (padding >= 0 ? " ".repeat(padding) : "") +
    segments.map((s) => (s[1] as ChalkInstance)(s[0])).join("") +
    (padding - fixer >= 0 ? " ".repeat(padding - fixer) : "");
  console.log(top + "│" + message + "│" + "\n" + bottom);
  // field
  console.log(
    top +
      field.map((r) => "│" + r.join("") + "│").join("\n") +
      "\n" +
      bottom +
      "\n",
  );
};

export default render;
