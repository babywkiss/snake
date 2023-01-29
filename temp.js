class Snake {
  constructor() {
    this.blocks = [[0, 0]];
    this.dirX = 0;
    this.dirY = 0;
  }
  getHead() {
    return this.blocks.slice(-1)[0];
  }
  getTail() {
    return this.blocks.slice(0, -1);
  }
  move(withGrow) {
    this.blocks.push(this.blocks.slice(-1).map(([x, y]) => [x + this.dirX, y + this.dirY])[0]);
  }
}
