import Game from "./game.js";
import chroma from "chroma-js";
import chalk from "chalk";

const createField = (game: Game) =>
  Array.from({ length: game.config.height }, (_) =>
    Array(game.config.width).fill("  ")
  );

export const render = (game: Game) => {
  console.clear();
  const field = createField(game);
  const snake = game.snake;
  const gradient = chroma.scale(["#89b4fa", "#a6e3a1"]).colors(snake.length);
  snake.forEach((c, i) => {
    let sym = " ";
    if (i === game.snake.length - 1) {
      sym = " ";
    } else {
      if (snake[i + 1].x > c.x) sym = " ";
      if (snake[i + 1].x < c.x) sym = " ";
      if (snake[i + 1].y < c.y) sym = " ";
      if (snake[i + 1].y > c.y) sym = " ";
    }
    field[c.y][c.x] = chalk.hex(gradient[i])(sym);
  });
  game.stones.forEach((c) => (field[c.y][c.x] = chalk.hex("#cdd6f4")(" ")));
  field[game.apple.y][game.apple.x] = chalk.hex("#eba0ac")(" ");
  const top = "╭" + "──".repeat(game.config.width) + "╮" + "\n";
  const bottom = "╰" + "──".repeat(game.config.width) + "╯" + "\n";
  console.log(
    top + field.map((r) => "│" + r.join("") + "│").join("\n") + "\n" + bottom
  );
};

export default render;
