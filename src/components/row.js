import React from 'react'
import * as R from 'ramda'
import { EMPTY_BLOCK, SOLID_BLOCK } from '../constants/block'
import styled  from 'styled-components/macro'

const Cell = styled.div`
  border: 1px solid #333;
  width: 5vh;
  height: 5vh;
  ${props => props.type == SOLID_BLOCK && `
    background-color: blue;
  `}
  ${props => props.isDropping && `
    background-color: green;
  `}
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`


const Row = (props) => {
  const { rowState, blockXPositions } = props
  // based on the type and position
  return (
    <Container>
      {
        R.addIndex(R.map)((cellState, index) => <Cell key={index} type={cellState} isDropping={R.includes(index, blockXPositions)} />)(rowState)
      }
    </Container>
  )
}

export default Row
