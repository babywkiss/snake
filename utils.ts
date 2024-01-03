export const chunked = <T>(arr: T[], chunkSize: number) => {
	const count = arr.length / chunkSize;
	const chunks = Array.from({ length: count }, (_, i) =>
		arr.slice(i * chunkSize, (i + 1) * chunkSize),
	);
	const remaining = arr.length % chunkSize;
	if (remaining !== 0) chunks.push(arr.slice(-remaining));
	return chunks;
};

export const hideCursorUntilRunning = () => {
	process.stdout.write("\x1b[s"); // save cursor position
	process.stderr.write("\u001B[?25l"); // hide cursor
	process.on("SIGINT", process.exit);
	process.on("exit", () => {
		process.stdout.write("\x1b[2J"); // clear screen
		process.stderr.write("\u001B[?25h"); // show cursor
		process.stdout.write("\x1b[u"); // restore cursor position
	});
};

export const setRawStdinSafe = () => {
	process.stdin.setRawMode(true);
	process.stdin.addListener("data", (data) => {
		if (data.toString() === "\u0003") process.exit();
	});
};

export const onKey = <T extends string>(
	keys: T[] | T,
	callback: (key: T) => void,
) => {
	const listener = (data: Buffer) => {
		if (Array.isArray(keys)) {
			const key = keys.find((k) => k === data.toString());
			if (key !== undefined) callback(key);
		} else {
			if (keys === data.toString()) callback(keys);
		}
	};
	process.stdin.addListener("data", listener);
	return () => process.stdin.removeListener("data", listener);
};
