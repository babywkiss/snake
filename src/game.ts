export interface Config {
  width: number;
  height: number;
  stones: number;
}

export type Coord = {
  x: number;
  y: number;
};

export const directions = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { y: -1, x: 0 },
  down: { y: 1, x: 0 },
};

const coordInBounds = (width: number, height: number) => ({
  x: Math.floor(Math.random() * width),
  y: Math.floor(Math.random() * height),
});

const isCoordsEqual = (coord1: Coord, coord2: Coord) =>
  coord1.x === coord2.x && coord1.y === coord2.y;

const isCoordIn = (coord: Coord, coords: Coord[]) => {
  return coords.find((c) => isCoordsEqual(c, coord));
};

export class Game {
  config: Config;
  snake: Coord[];
  stones: Coord[];
  apple: Coord;
  lastMove: keyof typeof directions | null;

  constructor(config: Config) {
    this.config = config;
    this.snake = Array.from({ length: 3 }, (_, i) => ({
      x: Math.floor(config.width / 2),
      y: i,
    }));
    this.stones = Array.from({ length: config.stones }, (_) =>
      coordInBounds(config.width, config.height)
    );
    this.apple = this.spawnApple();
    this.lastMove = null;
  }

  spawnApple() {
    let apple = coordInBounds(this.config.width, this.config.height);
    while (isCoordIn(apple, this.snake) || isCoordIn(apple, this.stones)) {
      apple = coordInBounds(this.config.width, this.config.height);
    }
    return apple;
  }

  getSnakeHead() {
    return this.snake.slice(-1)[0];
  }

  getSnakeTail() {
    return this.snake.slice(0, -1);
  }

  moveSnake(direction: Coord) {
    const head = this.getSnakeHead();
    this.snake.push({ x: head.x + direction.x, y: head.y + direction.y });
  }

  reduceSnakeTail() {
    this.snake.shift();
  }

  tick(move: keyof typeof directions) {
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
    this.moveSnake(directions[move]);
    const head = this.getSnakeHead();
    const tail = this.getSnakeTail();
    if (
      isCoordIn(head, tail) ||
      isCoordIn(head, this.stones) ||
      head.x >= this.config.width ||
      head.y >= this.config.height ||
      head.x < 0 ||
      head.y < 0
    ) {
      throw new Error();
    }
    if (isCoordsEqual(head, this.apple)) {
      this.apple = this.spawnApple();
    } else {
      this.reduceSnakeTail();
    }
    return this;
  }
}
