import { chunked, hideCursorUntilRunning, setRawStdinSafe } from "./utils";

export default class Canvas {
	width = process.stdout.columns;
	height = process.stdout.rows;
	#cells: string[] = Array(this.width * this.height).fill(" ");
	#diffs: Map<number, string> = new Map();

	constructor(height?: number, width?: number) {
		this.width = width ?? this.width;
		this.height = height ?? this.height;
	}

	#linearPos(x: number, y: number) {
		return this.width * y + x;
	}

	#coords(pos: number) {
		const x = pos % this.width;
		const y = Math.floor(pos / this.width);
		return { x, y };
	}

	clear() {
		for (let pos = 0; pos < this.#cells.length; pos++) {
			const { x, y } = this.#coords(pos);
			this.setCell(x, y, " ");
		}
	}

	setCell(x: number, y: number, ch: string) {
		const pos = this.#linearPos(x, y);
		if (this.#cells[pos] !== ch) {
			this.#diffs.set(pos, ch);
		} else {
			this.#diffs.delete(pos);
		}
	}

	flush() {
		const drawCalls = this.#diffs.size;
		for (const [pos, ch] of this.#diffs.entries()) {
			this.#cells[pos] = ch;
			const { x, y } = this.#coords(pos);
			process.stdout.write(`\x1b[${y + 1};${x + 1}H`);
			process.stdout.write(ch);
		}
		this.#diffs.clear();
		return drawCalls;
	}

	show() {
		hideCursorUntilRunning();
		setRawStdinSafe();
		process.stdout.write(
			chunked(this.#cells, this.width)
				.map((r) => r.join(""))
				.join("\n"),
		);
	}
}
