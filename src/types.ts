export type Coord = {
  x: number;
  y: number;
};

export type FieldSize = {
  width: number;
  height: number;
};

export type Config = {
  fieldSize: FieldSize;
  stones: number;
};

export type Direction = "left" | "right" | "up" | "down";
