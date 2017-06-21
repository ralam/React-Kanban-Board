import React from 'react';
import Card from './card';
import CardPlaceholder from './cardPlaceholder';

class Lane extends React.Component{
  constructor(props) {
    super(props);
    this.addCard = this.addCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
  }

  addCard(title, description) {
    this.props.addCard(title, description, this.props.laneIdx);
  }

  removeCard(cardIdx) {
    this.props.removeCard(this.props.laneIdx, cardIdx);
  }

  render() {
    let cards = this.props.cards.map((card, idx) => {
      return <Card
        title={card.title}
        description={card.description}
        key={idx}
        cardIdx={idx}
        removeCard={this.removeCard}
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