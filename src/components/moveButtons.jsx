import React from 'react';

class MoveButtons extends React.Component{
  constructor(props) {
    super(props);
    this.handleMove = this.handleMove.bind(this);
    this.LEFT = -1;
    this.RIGHT = 1;
  }

  handleMove(direction, e) {
    this.props.moveCard(direction);
  }

  render(){
    if(this.props.moveableDirections.left && this.props.moveableDirections.right) {
      return(
        <div>
          <span onClick={this.handleMove.bind(null, this.LEFT)} className='btn--direction'>&lt;</span>
          &nbsp;
          <span onClick={this.handleMove.bind(null, this.RIGHT)} className='btn--direction'>&gt;</span>
        </div>
      );
    } else if(this.props.moveableDirections.left) {
      return(
        <div>
          <span onClick={this.handleMove.bind(null, this.LEFT)} className='btn--direction'>&lt;</span>
        </div>
      );
    } else if(this.props.moveableDirections.right) {
      return(
        <div>
          <span onClick={this.handleMove.bind(null, this.RIGHT)} className='btn--direction'>&gt;</span>
        </div>
      );
    } else {
      // noop
      return <div></div>;
    }
  }
}

export default MoveButtons;