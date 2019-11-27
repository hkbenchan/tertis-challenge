import { combineReducers } from 'redux'
import storeGenerator from './middlewares/store'
import gameReducer from './modules/game'

export default storeGenerator(
  combineReducers({
    game: gameReducer
  })
)
