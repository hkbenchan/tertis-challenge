import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { boardSelector, currentBlockSelector } from '../redux/modules/game'

import styled from 'styled-components/macro'
import Row from '../components/row'
import { computeBlockPosition } from '../utils/block'

const Grid = styled.div`
  display: flex;
  flex-direction: column;
`

class Board extends React.PureComponent {

  render () {
    const { board, currentBlock } = this.props
    // draw the grid depending on the board state
    // compute all need to tint position
    const positions = computeBlockPosition(currentBlock)
    return (<Grid>
      {
        R.addIndex(R.map)((rowState, index) => {
          const computedXPositions = R.compose(
            R.map(pos => pos[0]),
            R.filter(pos => pos[1] == index),
          )(positions)
          return (<Row rowState={rowState} key={index} blockXPositions={computedXPositions} />)
        })(board)
      }
      </Grid>
    )
  }
}

const mapStateToProps = R.applySpec({
  board: boardSelector,
  currentBlock: currentBlockSelector,
})

export default connect(
  mapStateToProps
)(Board)
