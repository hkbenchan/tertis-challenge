export const EMPTY_BLOCK = 0
export const SOLID_BLOCK = 1
export const DROPPING_BLOCK = 2

export const BLOCK_TYPE = {
  LONG: 'long', // 1 x 4,
  // position is xCxx or
  // x
  // C
  // x
  // x
  SQUARE: 'square', // 2 x 2
  // position is
  // Cx
  // xx
  LSHAPE_1: 'l-shape-1', // 2 x 3 (L)
  // position is
  // x         x
  // x   or  xxC
  // Cx
  LSHAPE_2: 'l-shape-2', // 2 x 3 (L)
  // position is
  //  x      x
  //  x  or  Cxx
  // xC
  TSHAPE: 't-shape', // 2 x 3 (T)
  // position is
  //  x        x
  //  Cx  or  xCx
  //  x
}

export const BLOCK_DIRECTION = {
  N: 'N',
  E: 'E',
  S: 'S',
  W: 'W',
}
