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

const moveSnake = (snake, xDir, yDir) => {
  snake.push(snake.slice(-1).map(([x, y]) => [x + xDir, y + yDir])[0]); 
};

const getBoundedBlock = (xBound, yBound) => {
  return [Math.floor(Math.random() * xBound), Math.floor(Math.random() * yBound)];
};

const checkSnake = (snake, hx, hy, xBound, yBound) => {
  if (hx > xBound - 1 || hy > yBound - 1 || hx < 0 || hy < 0) return false;
  for (const [x, y] of snake.slice(0, -1)) {
    if (x === hx && y === hy) return false;
  };
  return true;
};


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

  setInterval(() => {
    console.clear();
    moveSnake(snake, xDir, yDir);
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
    console.log(formatField(field));
  }, speed)

  process.stdin.setRawMode(true);
  process.stdin.on('data', data => {
    if (data[0] === 3) process.exit();
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
    if (!key || key === prevKey) return;
    if (key === 'd' && prevKey !== 'u') [xDir, yDir] = [0, 1];
    if (key === 'u' && prevKey !== 'd') [xDir, yDir] = [0, -1];
    if (key === 'l' && prevKey !== 'r') [xDir, yDir] = [-1, 0];
    if (key === 'r' && prevKey !== 'l') [xDir, yDir] = [1, 0];
    prevKey = key;
  })
};

const FPS = 10;
const PROB = 5;
const XBOUND = 21;
const YBOUND = 21;
game(FPS, PROB, XBOUND, YBOUND);
