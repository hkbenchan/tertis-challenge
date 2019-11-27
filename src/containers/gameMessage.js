import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import styled from 'styled-components/macro'

import { isPlayingSelector, gamePointSelector } from '../redux/modules/game'

const Container = styled.div`
  display: flex;
  width: calc(100% - 16px);
  flex-direction: row;
  margin-left: 8px;
  margin-right: 8px;
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 20%;
  padding: 8px;
  span {
    font-size: 12pt;
  }
`

const Header = styled.div`
  font-size: 24pt;
  font-weight: 500;
  flex: 1 0 50%;
  padding: 8px;
`

const Score = styled.div`
  font-size: 20pt;
  flex: 1 0 20%;
  padding: 8px;
  ${props => props.isOver && `
    color: #FF9900;
  `}
`

const GameMessage = (props) => {
  const { score, isPlaying } = props
  return (
    <Container>
      <Controls>
        <span>{'key up for rotate'}</span>
        <span>{'key left/right for alignment'}</span>
        <span>{'key down for accelerate'}</span>
      </Controls>
      <Header>{'Tertis Challenge - Build this in 4 hours!'}</Header>
      {isPlaying && <Score>{`Score: ${score}`}</Score>}
      {!isPlaying && <Score isOver>{`Gameover! Your score: ${score}`}</Score>}
    </Container>
  )
}

const mapStateToProps = R.applySpec({
  isPlaying: isPlayingSelector,
  score: gamePointSelector,
})

export default connect(
  mapStateToProps,
)(GameMessage)
