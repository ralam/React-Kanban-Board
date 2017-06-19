import React from 'react';

class Card extends React.Component{
  constructor(props) {
    super(props);
    this.deleteCard = this.deleteCard.bind(this);
  }

  deleteCard(e) {
    this.props.removeCard(this.props.cardIdx);
  }

  render() {
    return(
      <div className='card'>
        <div className='card-action-container'>
          <div onClick={this.deleteCard}>x</div>
        </div>
        <div>{this.props.title}</div>
        <div>{this.props.description}</div>
      </div>
    )
  }
}

export default Card;