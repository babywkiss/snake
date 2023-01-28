const getField = (xBound, yBound) => Array.from({length: yBound}, _ => 
  Array.from({length: xBound}, _ => '〰️'));

const fillSnake = (field, snake) => snake.forEach(([x, y], i) => 
  field[y][x] = i === snake.length - 1 ? '🐸' : '🍀');
const formatField = (field) => field.map(line => line.join(" ")).join("\n");
const moveSnake = (snake, xDir, yDir) => {
  snake.push(snake.slice(-1).map(([x, y]) => [x + xDir, y + yDir])[0]); 
};
const spawnApple = (apples, xBound, yBound) => {
  apples.push([Math.floor(Math.random() * xBound), Math.floor(Math.random() * yBound)]);
};
const fillApples = (field, apples) => apples.forEach(([x, y]) => field[y][x] = '🍎');
const collectApple = (apples, hx, hy) => {
  const filtered = apples.filter(([x, y]) => !(x === hx && y === hy));
  return [filtered, filtered.length !== apples.length];
};
const checkSnake = (snake, hx, hy) => {
  for (const [x, y] of snake.slice(0, -1)) {
    if (x === hx && y === hy) return false;
  };
  return true;
};

const game = () => {
  const speed = 100;
  let prevMove = '';
  const snake = [[1, 1]];
  let [xDir, yDir] = [1, 0];
  const [xBound, yBound] = [15, 15]
  let apples = [];
  let score = 0;
  let grow = false;

  setInterval(() => {
    console.clear();
    moveSnake(snake, xDir, yDir);
    const [hx, hy] = snake.slice(-1)[0];
    if (hx > xBound - 1 || hy > yBound - 1 || hx < 0 || hy < 0 || !checkSnake(snake, hx, hy)) {
      console.log('-'.repeat(20));
      console.log(`| Score: ${score}!🎉`);
      console.log('-'.repeat(20));
      process.exit();
    }
    [apples, grow] = collectApple(apples, hx, hy);
    if (!grow) {
      snake.shift();
    } else {
      score++;
    };
    grow = false;
    if (Math.floor(Math.random() * 30) === 3) spawnApple(apples, xBound, yBound);
    const field = getField(xBound, yBound);
    fillApples(field, apples);
    fillSnake(field, snake);
    console.log(`Score: ${score} 🍏`);
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
    }
    const key = keys[data.toString()];
    console.log(key);
    if (!key || key === prevMove) return;
    if (key === 'd' && prevMove !== 'u') [xDir, yDir] = [0, 1];
    if (key === 'u' && prevMove !== 'd') [xDir, yDir] = [0, -1];
    if (key === 'l' && prevMove !== 'r') [xDir, yDir] = [-1, 0];
    if (key === 'r' && prevMove !== 'l') [xDir, yDir] = [1, 0];
    prevMove = key;
  })
};

game();
