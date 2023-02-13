<<<<<<< HEAD
const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[42m',
  RED: '\x1b[41m',
  YELLOW: '\x1b[43m',
  WHITE: '\x1b[47m',
}
const WHITE_BLOCK = COLORS.WHITE + '  ' + COLORS.RESET;
const YELLOW_BLOCK = COLORS.YELLOW + '  ' + COLORS.RESET;
const GREEN_BLOCK = COLORS.GREEN + '  ' + COLORS.RESET;

const padCenter = (str, width, space) => str.padStart((str.length + width) / 2, space).padEnd(width, space);

const getField = (xBound, yBound) => Array.from({length: yBound}, _ => 
  Array.from({length: xBound}, _ => '  '));

const formatField = (field) => {
  const xLine = WHITE_BLOCK.repeat(field[0].length + 2) + '\n';
  const body = field.map(line => WHITE_BLOCK + line.join("") + WHITE_BLOCK).join("\n") + '\n';
  return xLine + body + xLine;
};

const fillSnake = (field, snake) => snake.forEach(([x, y], i) => 
  field[y][x] = i === snake.length - 1 ? YELLOW_BLOCK : GREEN_BLOCK);

const fillApples = (field, apples) => apples.forEach(([x, y]) => 
  field[y][x] = COLORS.RED + '  ' + COLORS.RESET);
=======
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
  const applesCollected = snake.length - 1;
  const timePassed = Math.floor((Date.now() - timeStarted) / 1000);
  const blueLabel =
    FONT_COLORS.black + FONT_MODS.bright + BACKGROUND_COLORS.blue;
  const yellowLabel =
    FONT_COLORS.black + FONT_MODS.bright + BACKGROUND_COLORS.yellow;
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
>>>>>>> refactoring

const moveSnake = (snake, xDir, yDir) => {
  snake.push(snake.slice(-1).map(([x, y]) => [x + xDir, y + yDir])[0]);
};

<<<<<<< HEAD
const getBoundedBlock = (xBound, yBound) => {
  return [Math.floor(Math.random() * xBound), Math.floor(Math.random() * yBound)];
};

const checkSnake = (snake, hx, hy, xBound, yBound) => {
  if (hx > xBound - 1 || hy > yBound - 1 || hx < 0 || hy < 0) return false;
=======
const getBlockInBounds = (xBound, yBound) => [
  Math.floor(Math.random() * xBound),
  Math.floor(Math.random() * yBound),
];

const spawnApple = (xBound, yBound, snake) => {
  const apple = getBlockInBounds(xBound, yBound);
  while (true) {
    const sameCords = snake.find(([x, y]) => {
      apple[0] === x && apple[1] === y;
    });
    if (!sameCords) {
      break;
    } else {
      apple = getBlockInBounds(xBound, yBound);
    }
  }
  return apple;
};

const isSnakeCollided = (snake, xBound, yBound) => {
  const [xHead, yHead] = snake.slice(-1)[0];
  if (xHead > xBound - 1 || yHead > yBound - 1 || xHead < 0 || yHead < 0)
    return true;
>>>>>>> refactoring
  for (const [x, y] of snake.slice(0, -1)) {
    if (x === xHead && y === yHead) return true;
  }
  return false;
};

const isAppleCollected = (apple, snake) => {
  const [xHead, yHead] = snake.slice(-1)[0];
  return apple[0] === xHead && apple[1] === yHead;
};

<<<<<<< HEAD
const formatScore = (tickrate, prob, score, xBound, yBound, seconds) => {
  const xLine = WHITE_BLOCK.repeat(40) + '\n';
  const formatLine = s => WHITE_BLOCK + padCenter(s, 38, WHITE_BLOCK) + WHITE_BLOCK + '\n';
  let str = xLine + 
  "|" + padCenter(`FPS: ${tickrate}`, 38) + "|\n" +
  "|" + padCenter(`Probability: ${prob}`, 38) + "|\n" +
  "|" + padCenter(`Score: ${score}`, 38) + "|\n" + 
  "|" + padCenter(`Field: ${xBound}x${yBound}`, 38) + "|\n" + 
  "|" + padCenter(`Time: ${seconds} s`, 38) + "|\n" + 
  xLine;
  return str;
}

const game = (tickrate, xBound, yBound) => {
  const time_start = Date.now();
  const speed = 1000 / tickrate;
  let prevKey = '';
  const snake = [[1, 1]];
  let [xDir, yDir] = [0, 1];
  let apple = getBoundedBlock(xBound, yBound);
  let grow = false;
=======
const game = (fps, xBound, yBound) => {
  const timeStarted = Date.now();
  const speed = 1000 / fps;
  const snake = [[1, 1]];
  let [xDir, yDir] = [0, 1];
  let prevKey = "";
  let apple = spawnApple(xBound, yBound, snake);
>>>>>>> refactoring

  setInterval(() => {
    moveSnake(snake, xDir, yDir);
<<<<<<< HEAD
    const [hx, hy] = snake.slice(-1)[0];
    if (!checkSnake(snake, hx, hy, xBound, yBound, stones)) {
      console.log(formatScore(tickrate, prob, snake.length, xBound, yBound, (Date.now() - time_start) / 1000));
      process.exit();
    }
    [apples, grow] = collectApple(apples, hx, hy);
    if (!grow) snake.shift();
    grow = false;
    spawnApple(apples, xBound, yBound);
    const field = getField(xBound, yBound);
    // experiment
    stones.forEach(([x, y]) => field[y][x] = COLORS.WHITE + '  ' + COLORS.RESET);
    // experiment
    fillApples(field, apples);
    fillSnake(field, snake);
    console.log(
      padCenter(`Score: ${'\x1b[32m'}${snake.length} Apples${COLORS.RESET}`, xBound * 2 + 1) +
      `\nPassed: ${(Date.now() - time_start) / 1000} seconds.`
    );
=======
    if (isSnakeCollided(snake, xBound, yBound)) {
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
>>>>>>> refactoring
    console.log(formatField(field));
  }, speed);

  process.stdin.setRawMode(true);
  process.stdin.on("data", (data) => {
    if (data[0] === 3) process.exit();
<<<<<<< HEAD
    const keys = {
      '\033[A': 'u',
      '\033[B': 'd',
      '\033[D': 'l',
      '\033[C': 'r',
      's': 'd',
      'w': 'u',
      'a': 'l',
      'd': 'r',
    }
    const key = keys[data.toString()];
=======
    const key = KEYMAPS[data.toString()];
>>>>>>> refactoring
    if (!key || key === prevKey) return;
    if (key === "d" && prevKey !== "u") [xDir, yDir] = [0, 1];
    if (key === "u" && prevKey !== "d") [xDir, yDir] = [0, -1];
    if (key === "l" && prevKey !== "r") [xDir, yDir] = [-1, 0];
    if (key === "r" && prevKey !== "l") [xDir, yDir] = [1, 0];
    prevKey = key;
  });
};

const FPS = 10;
<<<<<<< HEAD
const PROB = 5;
const XBOUND = 21;
const YBOUND = 21;
game(FPS, PROB, XBOUND, YBOUND);
=======
const XBOUND = 18;
const YBOUND = 18;
game(FPS, XBOUND, YBOUND);
>>>>>>> refactoring
