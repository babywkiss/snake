export type Direction = "left" | "right" | "up" | "down";
export type Position = { x: number; y: number };

const getOpposite = (direction: Direction): Direction => {
	switch (direction) {
		case "left":
			return "right";
		case "right":
			return "left";
		case "down":
			return "up";
		case "up":
			return "down";
	}
};

const nextPos = ({ x, y }: Position, direction: Direction) => {
	switch (direction) {
		case "left":
			return { x: x - 1, y };
		case "right":
			return { x: x + 1, y };
		case "up":
			return { x, y: y - 1 };
		case "down":
			return { x, y: y + 1 };
	}
};

export default class Snake {
	positions: Position[] = [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 2, y: 0 },
	];
	#currentDir: Direction = "right";
	#prevDir: Direction = "right";

	get head() {
		return this.positions.at(-1) as Position;
	}

	get tail() {
		return this.positions.slice(0, -1);
	}

	get last() {
		return this.positions[0];
	}

	set direction(direction: Direction) {
		if (!(getOpposite(this.#prevDir) === direction))
			this.#currentDir = direction;
	}

	move() {
		this.positions.push(nextPos(this.head, this.#currentDir));
		this.positions.shift();
		this.#prevDir = this.#currentDir;
	}

	grow() {
		this.positions.unshift(nextPos(this.last, getOpposite(this.#prevDir)));
	}

	isValid(bounds: Position) {
		const { x: headX, y: headY } = this.head;
		const isSelfCollided = this.tail.some(
			({ x, y }) => x === headX && y === headY,
		);
		const isInBounds =
			headX >= 0 && headY >= 0 && headX < bounds.x && headY < bounds.y;
		return !isSelfCollided && isInBounds;
	}
}
