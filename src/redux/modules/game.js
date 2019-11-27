// redux-ducks design
// include actions, reducers
import { GRID_WIDTH, GRID_HEIGHT } from '../../constants/game'
import { EMPTY_BLOCK, DROPPING_BLOCK, BLOCK_TYPE, BLOCK_DIRECTION } from '../../constants/block'
import * as R from 'ramda'
import { createSelector } from 'reselect'

import { computeBlockPosition, validateBoard, taintBoardPositionAsSolid, clearCompletedBoardLines } from '../../utils/block'
// game board state will store inside redux

const SCOPE = 'TERTIS'

// actions
const ADVANCED_BOARD = `${SCOPE}/ADVANCED_BOARD`
const MOVE_BLOCK_LEFT = `${SCOPE}/MOVE_BLOCK_LEFT`
const MOVE_BLOCK_RIGHT = `${SCOPE}/MOVE_BLOCK_RIGHT`
const ROTATE_BLOCK = `${SCOPE}/ROTATE_BLOCK`
const MOVE_BLOCK_DOWN = `${SCOPE}.MOVE_BLOCK_DOWN`

export const advanceBoard = () => ({
  type: ADVANCED_BOARD
})

export const moveBlockLeft = () => ({
  type: MOVE_BLOCK_LEFT
})

export const moveBlockRight = () => ({
  type: MOVE_BLOCK_RIGHT
})

export const rotateBlock = () => ({
  type: ROTATE_BLOCK
})

export const moveBlockDown = () => ({
  type: MOVE_BLOCK_DOWN
})

// initial state

const generateEmptyBoard = (width, height) => {
  return R.map(() => Array(width).fill(EMPTY_BLOCK))(Array(height))
}

const defaultBlockComposition = {
  direction: BLOCK_DIRECTION.N,
}

const generateNewBlockType = () => {
  const blockTypeKeys = R.keys(BLOCK_TYPE)
  const key = Math.floor(Math.random() * blockTypeKeys.length)
  return BLOCK_TYPE[blockTypeKeys[key]]
}

const generateNewBlock = () => {
  const type = generateNewBlockType()
  let position
  switch (type) {
    case BLOCK_TYPE.LONG:
    case BLOCK_TYPE.LSHAPE_1:
    case BLOCK_TYPE.LSHAPE_2:
      position = [GRID_WIDTH/2, -3]
      break
    case BLOCK_TYPE.SQUARE:
    case BLOCK_TYPE.TSHAPE:
      position = [GRID_WIDTH/2, -2]
      break
    default:
      position = [GRID_WIDTH/2, 0]
  }
  return {
    type,
    position,
    ...defaultBlockComposition
  }
}

const initialState = {
  board: generateEmptyBoard(GRID_WIDTH, GRID_HEIGHT),
  currentDroppingBlock: generateNewBlock(),
  isPlaying: true,
  gamePoint: 0,
}

// reducer

const advancedBoardReducer = (state, action) => {
  // find the dropping block and make sure it can dropped (i.e. y index++)
  const { isPlaying } = state
  if (!isPlaying) {
    console.log('not playing')
    return state
  }
  const currentPosition = state.currentDroppingBlock.position
  const newPosition = [
    currentPosition[0],
    currentPosition[1] + 1
  ]
  const updatedBlock = {
    ...state.currentDroppingBlock,
    position: newPosition
  }
  // validate the new position
  const isValidated = validateBoard(state.board, updatedBlock)
  // if failed, generate a new block
  if (!isValidated) {
    const newBlock = generateNewBlock()
    // is any block part hanging outside?
    const { newBoard: tempBoard, anyUnpaintPart } = taintBoardPositionAsSolid(state.board, state.currentDroppingBlock)
    if (anyUnpaintPart) {
      // gameover!
      console.log('game over')
      return {
        ...state,
        board: tempBoard,
        isPlaying: false,
        currentDroppingBlock: newBlock
      }
    }
    const { newBoard, pointReceived } = clearCompletedBoardLines(tempBoard)
    return {
      ...state,
      board: newBoard,
      currentDroppingBlock: newBlock,
      gamePoint: state.gamePoint + pointReceived,
    }
  }
  return {
    ...state,
    currentDroppingBlock: updatedBlock
  }
}

const moveBlockRedcuer = (state, action) => {
  const currentPosition = state.currentDroppingBlock.position
  const newPosition = [
    action.type === MOVE_BLOCK_LEFT ? currentPosition[0] - 1 : currentPosition[0] + 1,
    currentPosition[1]
  ]
  const updatedBlock = {
    ...state.currentDroppingBlock,
    position: newPosition
  }
  // validate the new position
  const isValidated = validateBoard(state.board, updatedBlock)
  if (isValidated) {
    return {
      ...state,
      currentDroppingBlock: updatedBlock
    }
  } else {
    return state
  }
}

const rotateBlockReducer = (state, action) => {
  const currentDirection = state.currentDroppingBlock.direction
  let nextDirection
  switch (currentDirection) {
    case BLOCK_DIRECTION.N:
      nextDirection = BLOCK_DIRECTION.E
      break
    case BLOCK_DIRECTION.E:
      nextDirection = BLOCK_DIRECTION.S
      break
    case BLOCK_DIRECTION.S:
      nextDirection = BLOCK_DIRECTION.W
      break
    case BLOCK_DIRECTION.W:
    default:
      nextDirection = BLOCK_DIRECTION.N
      break
  }
  const updatedBlock = {
    ...state.currentDroppingBlock,
    direction: nextDirection
  }
  // validate the new position
  const isValidated = validateBoard(state.board, updatedBlock)
  if (isValidated) {
    return {
      ...state,
      currentDroppingBlock: updatedBlock
    }
  } else {
    return state
  }
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADVANCED_BOARD:
    case MOVE_BLOCK_DOWN:
      return advancedBoardReducer(state, action)
      break
    case MOVE_BLOCK_LEFT:
    case MOVE_BLOCK_RIGHT:
      return moveBlockRedcuer(state, action)
      break
    case ROTATE_BLOCK:
      return rotateBlockReducer(state, action)
      break
    default:
      return state
  }
}

// selectors
export const boardSelector = state => state.game.board
export const currentBlockSelector = state => state.game.currentDroppingBlock
export const isPlayingSelector = state => state.game.isPlaying
export const gamePointSelector = state => state.game.gamePoint
