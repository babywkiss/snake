export const keyboard = (onKeydown: (key: string) => void) => {
  process.stdin.setRawMode(true);
  process.stdin.on("data", (data) => {
    if (data[0] === 3) process.exit();
    onKeydown(data.toString());
  });
};
