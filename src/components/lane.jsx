import React from 'react';
import Card from './card';
import CardPlaceholder from './cardPlaceholder';

class Lane extends React.Component{
  constructor(props) {
    super(props);
    this.addCard = this.addCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.moveCard = this.moveCard.bind(this);
  }

  addCard(title, description) {
    this.props.addCard(title, description, this.props.laneIdx);
  }

  removeCard(cardIdx) {
    this.props.removeCard(this.props.laneIdx, cardIdx);
  }

  updateCard(title, description, cardIdx) {
    this.props.updateCard(title, description, this.props.laneIdx, cardIdx);
  }

  moveCard(direction, cardIdx) {
    let newLaneIdx = this.props.laneIdx + direction;
    this.props.moveCard(this.props.laneIdx, newLaneIdx, cardIdx);
  }

  render() {
    let cards = this.props.cards.map((card, idx) => {
      return <Card
        title={card.title}
        description={card.description}
        key={idx}
        cardIdx={idx}
        removeCard={this.removeCard}
        updateCard={this.updateCard}
        moveCard={this.moveCard}
        moveableDirections={this.props.cardMoveableDirections}
        />
    });
    return(
      <div className='lane'>
        <div>{this.props.title}</div>
        {cards}
        <CardPlaceholder addCard={this.addCard} />
      </div>
    )
  }
}

export default Lane;