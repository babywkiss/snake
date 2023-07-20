import type { Coord, Config, FieldSize, Direction } from "./types.js";

const DIRECTIONS = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { y: -1, x: 0 },
  down: { y: 1, x: 0 },
} as const;

const getCoordInBounds = (bounds: FieldSize): Coord => ({
  x: Math.floor(Math.random() * bounds.width),
  y: Math.floor(Math.random() * bounds.height),
});

const isCoordsEqual = (a: Coord, b: Coord) => a.x === b.x && a.y === b.y;

const isCoordIn = (coord: Coord, coords: Coord[]) => {
  return coords.find((c) => isCoordsEqual(c, coord));
};

export class Game {
  config: Config;
  snake: Coord[];
  stones: Coord[];
  apple: Coord;
  lastMove: Direction | null;

  constructor(config: Config) {
    this.config = config;
    this.snake = Array.from({ length: 3 }, (_, i) => ({
      x: Math.floor(config.fieldSize.width / 2),
      y: i,
    }));
    this.stones = Array.from({ length: config.stones }, (_) =>
      getCoordInBounds(config.fieldSize),
    );
    this.apple = this.#spawnApple();
    this.lastMove = null;
  }

  #spawnApple() {
    let apple = getCoordInBounds(this.config.fieldSize);
    while (isCoordIn(apple, this.snake) || isCoordIn(apple, this.stones)) {
      apple = getCoordInBounds(this.config.fieldSize);
    }
    return apple;
  }

  #getSnakeHead() {
    return this.snake.slice(-1)[0];
  }

  #getSnakeTail() {
    return this.snake.slice(0, -1);
  }

  #moveSnake(direction: Coord) {
    const head = this.#getSnakeHead();
    this.snake.push({ x: head.x + direction.x, y: head.y + direction.y });
  }

  #reduceSnakeTail() {
    this.snake.shift();
  }

  tick(move: Direction) {
    const lastMove = this.lastMove;
    if (lastMove) {
      const notPossibleMove =
        (move === "down" && lastMove === "up") ||
        (move === "up" && lastMove === "down") ||
        (move === "left" && lastMove === "right") ||
        (move === "right" && lastMove === "left");
      if (notPossibleMove) {
        move = lastMove;
      }
    }
    this.lastMove = move;
    this.#moveSnake(DIRECTIONS[move]);
    const head = this.#getSnakeHead();
    const tail = this.#getSnakeTail();
    if (
      isCoordIn(head, tail) ||
      isCoordIn(head, this.stones) ||
      head.x >= this.config.fieldSize.width ||
      head.y >= this.config.fieldSize.height ||
      head.x < 0 ||
      head.y < 0
    ) {
      throw new Error();
    }
    if (isCoordsEqual(head, this.apple)) {
      this.apple = this.#spawnApple();
    } else {
      this.#reduceSnakeTail();
    }
    return this;
  }
}

export default Game;
