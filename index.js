const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[42m',
  RED: '\x1b[41m',
  YELLOW: '\x1b[43m',
}
const BLOCK = COLORS.YELLOW + ' ' + COLORS.RESET 

const padCenter = (str, width) => str.padStart((str.length + width) / 2).padEnd(width);
const getField = (xBound, yBound) => Array.from({length: yBound}, _ => 
  Array.from({length: xBound}, _ => ' '));

const formatField = (field) => {
  const xLine = BLOCK.repeat(field[0].length * 2 + 1) + '\n';
  str = xLine;
  str += field.map(line => BLOCK + line.join(" ") + BLOCK).join("\n");
  str += '\n' + xLine;
  return str;
};

const fillSnake = (field, snake) => snake.forEach(([x, y]) => 
  field[y][x] = COLORS.GREEN + " " + COLORS.RESET);

const moveSnake = (snake, xDir, yDir) => {
  snake.push(snake.slice(-1).map(([x, y]) => [x + xDir, y + yDir])[0]); 
};

const spawnApple = (apples, xBound, yBound) => {
  apples.push([Math.floor(Math.random() * xBound), Math.floor(Math.random() * yBound)]);
};

const fillApples = (field, apples) => apples.forEach(([x, y]) => 
  field[y][x] = COLORS.RED + ' ' + COLORS.RESET);

const collectApple = (apples, hx, hy) => {
  const filtered = apples.filter(([x, y]) => !(x === hx && y === hy));
  const collected = filtered.length !== apples.length
  return [filtered, collected];
};

const checkSnake = (snake, hx, hy, xBound, yBound) => {
  if (hx > xBound - 1 || hy > yBound - 1 || hx < 0 || hy < 0) return false;
  for (const [x, y] of snake.slice(0, -1)) {
    if (x === hx && y === hy) return false;
  };
  return true;
};


const formatScore = (fps, prob, score, xBound, yBound, seconds) => {
  const xLine = "-".repeat(40) + '\n';
  let str = xLine + 
  "|" + padCenter(`FPS: ${fps}`, 38) + "|\n" +
  "|" + padCenter(`Probability: ${prob}`, 38) + "|\n" +
  "|" + padCenter(`Score: ${score}`, 38) + "|\n" + 
  "|" + padCenter(`Field: ${xBound}x${yBound}`, 38) + "|\n" + 
  "|" + padCenter(`Time: ${seconds} s`, 38) + "|\n" + 
  xLine;
  return str;
}

const game = (fps, prob, xBound, yBound) => {
  const start = Date.now();
  const speed = 1000 / fps;
  let prevKey = '';
  const snake = [[1, 1]];
  let [xDir, yDir] = [0, 1];
  let apples = [];
  let grow = false;

  setInterval(() => {
    console.clear();
    moveSnake(snake, xDir, yDir);
    const [hx, hy] = snake.slice(-1)[0];
    if (!checkSnake(snake, hx, hy, xBound, yBound)) {
      console.log(formatScore(fps, prob, snake.length, xBound, yBound, (Date.now() - start) / 1000));
      process.exit();
    }
    [apples, grow] = collectApple(apples, hx, hy);
    if (!grow) snake.shift();
    grow = false;
    if (Math.floor(Math.random() * 100) < prob) spawnApple(apples, xBound, yBound);
    const field = getField(xBound, yBound);
    fillApples(field, apples);
    fillSnake(field, snake);
    console.log(
      padCenter(`Score: ${'\x1b[32m'}${snake.length} Apples${COLORS.RESET}`, xBound * 2 + 1) +
      `\nPassed: ${(Date.now() - start) / 1000} seconds.`
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
      'j': 'd',
      'k': 'u',
      'h': 'l',
      'l': 'r',
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

const FPS = 7;
const PROB = 27;
const XBOUND = 27;
const YBOUND = 27;
game(FPS, PROB, XBOUND, YBOUND);
