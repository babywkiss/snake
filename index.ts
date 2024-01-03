import Canvas from "./canvas";
import Snake from "./snake";
import { onKey } from "./utils";

const canvas = new Canvas();

const centerY = Math.floor(canvas.height / 2);

const createApple = () => {
	while (true) {
		const pos = {
			x: Math.floor((Math.random() * canvas.width) / 2),
			y: Math.floor(Math.random() * canvas.height),
		};
		if (!snake.positions.some(({ x, y }) => x === pos.x || y === pos.y))
			return pos;
	}
};

canvas.show();

let snake = new Snake();
let apple = createApple();
let start = Date.now();
let over = false;

const cycle = () => {
	canvas.clear();
	// render status
	const status = `│ Snake size: ${snake.positions.length} | Time passed: ${(
		(Date.now() - start) /
		1000
	).toFixed(2)} s │`;
	for (const [i, ch] of [...status].entries()) {
		canvas.setCell(Math.floor((canvas.width - status.length) / 2) + i, 0, ch);
	}
	// render snake
	for (const { x, y } of snake.positions) {
		canvas.setCell(x * 2, y, "\x1b[34m█\x1b[0m");
		canvas.setCell(x * 2 + 1, y, "\x1b[34m█\x1b[0m");
	}
	canvas.setCell(apple.x * 2, apple.y, "\x1b[31m█\x1b[0m");
	canvas.setCell(apple.x * 2 + 1, apple.y, "\x1b[31m█\x1b[0m");
	canvas.flush();
	// game logic
	snake.move();
	if (snake.head.x === apple.x && snake.head.y === apple.y) {
		snake.grow();
		apple = createApple();
	}
	if (!snake.isValid({ x: canvas.width / 2, y: canvas.height })) {
		over = true;
		const message = '[ Game Over, press "q" to exit, "r" to play again. ]';
		for (const [i, ch] of [...message].entries()) {
			canvas.setCell(
				Math.floor((canvas.width - message.length) / 2) + i,
				centerY,
				ch,
			);
		}
		canvas.flush();
		clearInterval(interval);
	}
};

let interval = setInterval(cycle, 30);

onKey("r", () => {
	if (over) {
		snake = new Snake();
		apple = createApple();
		start = Date.now();
		canvas.clear();
		canvas.flush();
		interval = setInterval(cycle, 30);
		over = false;
	}
});

onKey("q", () => {
	if (over) {
		process.exit();
	}
});

const KEYMAP = {
	j: "down",
	k: "up",
	h: "left",
	l: "right",
} as const;

onKey(Object.keys(KEYMAP) as (keyof typeof KEYMAP)[], (key) => {
	snake.direction = KEYMAP[key];
});
