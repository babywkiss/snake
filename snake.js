const FONT_MODS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
};

const FONT_COLORS = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

const BACKGROUND_COLORS = {
  black: "\x1b[40m",
  red: "\x1b[41m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  blue: "\x1b[44m",
  magenta: "\x1b[45m",
  cyan: "\x1b[46m",
  white: "\x1b[47m",
};

const KEYMAPS = {
  "\033[A": "u",
  "\033[B": "d",
  "\033[D": "l",
  "\033[C": "r",
  j: "d",
  k: "u",
  h: "l",
  l: "r",
};

const getField = (xBound, yBound) =>
  Array.from({ length: yBound }, (_) =>
    Array.from({ length: xBound }, (_) => "  ")
  );

const formatField = (field) => {
  const block = BACKGROUND_COLORS.white + "  " + FONT_MODS.reset;
  const xLine = block.repeat(field[0].length + 2) + "\n";
  const body = field.map((line) => block + line.join("") + block).join("\n");
  return xLine + body + "\n" + xLine;
};

const formatScore = (snake, timeStarted) => {
  const applesCollected = snake.length - 2;
  const timePassed = Math.floor((Date.now() - timeStarted) / 1000);
  const blueLabel =
    FONT_COLORS.black + FONT_MODS.bright + BACKGROUND_COLORS.red;
  const yellowLabel =
    FONT_COLORS.black + FONT_MODS.bright + BACKGROUND_COLORS.magenta;
  return `${blueLabel} Score: ${applesCollected} apples. ${yellowLabel} Passed: ${timePassed} sec. ${FONT_MODS.reset}`;
};

const drawSnake = (field, snake) => {
  const headBlock = BACKGROUND_COLORS.yellow + "  " + FONT_MODS.reset;
  const bodyBlock = BACKGROUND_COLORS.green + "  " + FONT_MODS.reset;
  snake.forEach(
    ([x, y], i) =>
      (field[y][x] = i === snake.length - 1 ? headBlock : bodyBlock)
  );
};

const drawApple = (field, apple) => {
  const [xApple, yApple] = apple;
  field[yApple][xApple] = BACKGROUND_COLORS.red + "  " + FONT_MODS.reset;
};

const moveSnake = (snake, xDir, yDir) => {
  snake.push(snake.slice(-1).map(([x, y]) => [x + xDir, y + yDir])[0]);
};

const getBlockInBounds = (xBound, yBound) => [
  Math.floor(Math.random() * xBound),
  Math.floor(Math.random() * yBound),
];

const spawnApple = (xBound, yBound, snake) => {
  const apple = getBlockInBounds(xBound, yBound);
  while (true) {
    const sameFound = snake.find(([x, y]) => {
      apple[0] === x && apple[1] === y;
    });
    if (!sameFound) {
      return apple;
    } else {
      apple = getBlockInBounds(xBound, yBound);
    }
  }
};

const isSnakeCollided = (snake, xBound, yBound) => {
  const [xHead, yHead] = snake.slice(-1)[0];
  if (xHead > xBound - 1 || yHead > yBound - 1 || xHead < 0 || yHead < 0)
    return true;
  for (const [x, y] of snake.slice(0, -1)) {
    if (x === xHead && y === yHead) return true;
  }
  return false;
};

const isAppleCollected = (apple, snake) => {
  const [xHead, yHead] = snake.slice(-1)[0];
  return apple[0] === xHead && apple[1] === yHead;
};

const game = (fps, xBound, yBound) => {
  const timeStarted = Date.now();
  const speed = 1000 / fps;
  const snake = [
    [1, 0],
    [1, 1],
  ];
  let [xDir, yDir] = [0, 1];
  let prevKey = "";
  let apple = spawnApple(xBound, yBound, snake);

  setInterval(() => {
    moveSnake(snake, xDir, yDir);
    if (isSnakeCollided(snake, xBound, yBound)) {
      const cyanLabel =
        FONT_COLORS.black + FONT_MODS.bright + BACKGROUND_COLORS.cyan;
      console.clear();
      console.log(
        `${cyanLabel} Results at ${fps} FPS on field ${xBound}x${yBound}: ${FONT_MODS.reset}`
      );
      console.log(formatScore(snake, timeStarted));
      process.exit();
    }
    if (isAppleCollected(apple, snake)) {
      apple = spawnApple(xBound, yBound, snake);
    } else {
      snake.shift();
    }
    const field = getField(xBound, yBound);
    drawSnake(field, snake);
    drawApple(field, apple);
    console.clear();
    console.log(formatScore(snake, timeStarted));
    console.log(formatField(field));
    console.log(process.argv);
  }, speed);

  process.stdin.setRawMode(true);
  process.stdin.on("data", (data) => {
    if (data[0] === 3) process.exit();
    const key = KEYMAPS[data.toString()];
    if (!key || key === prevKey) return;
    if (key === "d" && prevKey !== "u") [xDir, yDir] = [0, 1];
    if (key === "u" && prevKey !== "d") [xDir, yDir] = [0, -1];
    if (key === "l" && prevKey !== "r") [xDir, yDir] = [-1, 0];
    if (key === "r" && prevKey !== "l") [xDir, yDir] = [1, 0];
    prevKey = key;
  });
};

const FPS = parseInt(process.argv[2]) || 10;
const XBOUND = parseInt(process.argv[3]) || 18;
const YBOUND = parseInt(process.argv[3]) || 18;

game(FPS, XBOUND, YBOUND);
