import React from 'react';

class Card extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div className='card'>
        <div>{this.props.title}</div>
        <div>{this.props.description}</div>
      </div>
    )
  }
}

export default Card;