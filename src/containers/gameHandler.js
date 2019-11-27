import React from 'react'
import { DEFAULT_GRAVITY } from '../constants/game'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { isPlayingSelector, advanceBoard, moveBlockLeft, moveBlockRight, rotateBlock, moveBlockDown } from '../redux/modules/game'

class Handler extends React.PureComponent {

  onKeydown = (event) => {
    const { isPlaying, moveBlockLeft, moveBlockRight, rotateBlock, moveBlockDown } = this.props
    if (!isPlaying) {
      return
    }
    switch (event.keyCode) {
      case 37: // left
        moveBlockLeft()
        break
      case 38: // up
        rotateBlock()
        break
      case 39: // right
        moveBlockRight()
        break
      case 40: // down
        moveBlockDown()
        break
    }
  }

  componentDidMount () {
    setTimeout(this.update, 1000/DEFAULT_GRAVITY)
    document.addEventListener('keydown', this.onKeydown, false)
  }

  componentWillUnmount () {
    document.removeListener('keydown', this.onKeydown, false)
  }

  update = () => {
    const { advanceBoard, isPlaying } = this.props
    if (!isPlaying) {
      return
    }
    advanceBoard()
    setTimeout(this.update, 1000/DEFAULT_GRAVITY)
  }

  render () {
    return null
  }
}

const mapStateToProps = R.applySpec({
  isPlaying: isPlayingSelector
})

const mapDispatchToProps = {
  advanceBoard,
  moveBlockLeft,
  moveBlockRight,
  rotateBlock,
  moveBlockDown
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Handler)
