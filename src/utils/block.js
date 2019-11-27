import * as R from 'ramda'
import { SOLID_BLOCK, EMPTY_BLOCK, BLOCK_TYPE, BLOCK_DIRECTION } from '../constants/block'
import { GRID_WIDTH, GRID_HEIGHT} from '../constants/game'

const longBlockPositions = currentBlock => {
  const { direction, position } = currentBlock
  switch (direction) {
    // 1w 4h
    case BLOCK_DIRECTION.N:
    case BLOCK_DIRECTION.S:
      return [
        [position[0], position[1] - 1],
        [position[0], position[1]],
        [position[0], position[1] + 1],
        [position[0], position[1] + 2],
      ]
    default:
      return [
        [position[0] - 1, position[1]],
        [position[0], position[1]],
        [position[0] + 1, position[1]],
        [position[0] + 2, position[1]],
      ]
  }
}

const squareBlockPositions = currentBlock => {
  const { position } = currentBlock
  return [
    [position[0], position[1]],
    [position[0], position[1] + 1],
    [position[0]+1, position[1]],
    [position[0]+1, position[1] + 1],
  ]
}

const lShape1BlockPositions = currentBlock => {
  const { direction, position } = currentBlock
  switch (direction) {
    case BLOCK_DIRECTION.N:
      return [
        [position[0] - 1, position[1]],
        [position[0], position[1]],
        [position[0], position[1] + 1],
        [position[0], position[1] + 2],
      ]
    case BLOCK_DIRECTION.E:
      return [
        [position[0], position[1] - 1],
        [position[0], position[1]],
        [position[0] - 1, position[1]],
        [position[0] - 2, position[1]],
      ]
    case BLOCK_DIRECTION.S:
      return [
        [position[0] +  1, position[1]],
        [position[0], position[1]],
        [position[0], position[1] - 1],
        [position[0], position[1] - 2],
      ]
    case BLOCK_DIRECTION.W:
      return [
        [position[0], position[1] + 1],
        [position[0], position[1]],
        [position[0] + 1, position[1]],
        [position[0] + 2, position[1]],
      ]
  }
}

const lShape2BlockPositions = currentBlock => {
  const { direction, position } = currentBlock
  switch (direction) {
    case BLOCK_DIRECTION.N:
      return [
        [position[0] + 1, position[1]],
        [position[0], position[1]],
        [position[0], position[1] + 1],
        [position[0], position[1] + 2],
      ]
    case BLOCK_DIRECTION.E:
      return [
        [position[0], position[1] + 1],
        [position[0], position[1]],
        [position[0] - 1, position[1]],
        [position[0] - 2, position[1]],
      ]
    case BLOCK_DIRECTION.S:
      return [
        [position[0] -  1, position[1]],
        [position[0], position[1]],
        [position[0], position[1] - 1],
        [position[0], position[1] - 2],
      ]
    case BLOCK_DIRECTION.W:
      return [
        [position[0], position[1] - 1],
        [position[0], position[1]],
        [position[0] + 1, position[1]],
        [position[0] + 2, position[1]],
      ]
  }
}


const tShapeBlockPositions = currentBlock => {
  const { direction, position } = currentBlock
  switch (direction) {
    case BLOCK_DIRECTION.N:
      return [
        [position[0] - 1, position[1]],
        [position[0], position[1]],
        [position[0] + 1, position[1]],
        [position[0], position[1] + 1],
      ]
    case BLOCK_DIRECTION.E:
      return [
        [position[0], position[1] - 1],
        [position[0], position[1]],
        [position[0], position[1] + 1],
        [position[0] - 1, position[1]],
      ]
    case BLOCK_DIRECTION.S:
      return [
        [position[0] -  1, position[1]],
        [position[0], position[1]],
        [position[0] + 1, position[1]],
        [position[0], position[1] - 1],
      ]
    case BLOCK_DIRECTION.W:
      return [
        [position[0], position[1] - 1],
        [position[0], position[1]],
        [position[0], position[1] + 1],
        [position[0] + 1, position[1]],
      ]
  }
}

export const computeBlockPosition = currentBlock => {
  const { type } = currentBlock
  switch (type) {
    case BLOCK_TYPE.LONG:
      return longBlockPositions(currentBlock)
    case BLOCK_TYPE.SQUARE:
      return squareBlockPositions(currentBlock)
    case BLOCK_TYPE.LSHAPE_1:
      return lShape1BlockPositions(currentBlock)
    case BLOCK_TYPE.LSHAPE_2:
      return lShape2BlockPositions(currentBlock)
    case BLOCK_TYPE.TSHAPE:
      return tShapeBlockPositions(currentBlock)
    default:
      return [] // nothing
  }
}

export const validateBoard = (board, block) => {
  const positions = computeBlockPosition(block)

  // 1. out of bound
  const isOutOfBound = R.compose(
    R.lt(0),
    R.length,
    R.filter(pos => pos[0] < 0 || pos[0] >= GRID_WIDTH || pos[1] >= GRID_HEIGHT)
  )(positions)

  if (isOutOfBound) {
    return false
  }

  // 2. collide existing
  const isCollided = R.compose(
    R.lt(0),
    R.length,
    R.filter(pos => {
      return pos[1] >= 0 && board[pos[1]][pos[0]] == SOLID_BLOCK
    })
  )(positions)

  return !isCollided
}

export const taintBoardPositionAsSolid = (board, block) => {
  const positions = computeBlockPosition(block)

  const isOutOfBound = R.compose(
    R.lt(0),
    R.length,
    R.filter(pos => pos[0] < 0 || pos[0] >= GRID_WIDTH || pos[1] >= GRID_HEIGHT || pos[1] < 0)
  )(positions)

  return {
    newBoard: R.addIndex(R.map)((row, rowIndex) => {
      return R.addIndex(R.map)((cell, cellIndex) => {
        return R.includes([cellIndex, rowIndex])(positions) ? SOLID_BLOCK : cell
      })(row)
    })(board),
    anyUnpaintPart: isOutOfBound,
  }
}

export const clearCompletedBoardLines = (board) => {
  const pointReceived = R.compose(
    R.length,
    R.filter(row => R.all(R.equals(SOLID_BLOCK))(row))
  )(board)

  if (pointReceived === 0) {
    return {
      newBoard: board,
      pointReceived
    }
  }
  const newBoard = R.compose(
    R.concat(R.times(() => Array(GRID_WIDTH).fill(EMPTY_BLOCK), pointReceived)),
    R.tap(x => console.log(x)),
    R.reject(row => R.all(R.equals(SOLID_BLOCK))(row))
  )(board)
  console.log(newBoard)
  return {
    newBoard,
    pointReceived
  }
}
