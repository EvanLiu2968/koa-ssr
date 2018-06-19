/**
 *  animation-duration: 2s;    //动画持续时间   ->animationDuration
 *  animation-delay: 1s;    //动画延迟时间       ->animationDelay:
 *  animation-iteration-count: 2;    //动画执行次数            ->animationIterationCount
 */
import React from 'react'
import ReactDOM from 'react-dom'

class Animate extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      animate: this.props.animate || 'fadeOut',
      duration: this.props.duration || '',
      delay: this.props.delay || '',
      content: this.props.children || ''
    }
  }
  render() {
    let className = 'animated ' + this.state.animate
    return (
      <div className={className} >
        {this.state.content}
      </div>
    )
  }
}
export default Animate