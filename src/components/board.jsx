import React from 'react';
import Lane from './lane';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class Board extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title: 'My Board',
      statuses: [
        {title: 'Planned', cards: [
          {title: 'Card 1', description: 'some stuff'},
          {title: 'Card 2', description: 'more stuff'}
        ]},
        {title: 'Design', cards: [
          {title: 'Card 1', description: 'some stuff'},
          {title: 'Card 2', description: 'more stuff'}
        ]},
        {title: 'In Progress', cards: [{title: 'Card 3', description: 'lorem ipsum'}]},
        {title: 'Testing', cards: [{title: 'Card 3', description: 'lorem ipsum'}]},
        {title: 'Done', cards: [
          {title: 'Card 4', description: 'bananas'},
          {title: 'Card 5', description: 'oranges'},
          {title: 'Card 6', description: 'apples'}
        ]}
      ]
    }
    this.addCard = this.addCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.moveCard = this.moveCard.bind(this);
  }

  addCard(cardTitle, cardDescription, laneIdx) {
    let statuses = this.state.statuses;
    statuses[laneIdx].cards.push({title: cardTitle, description: cardDescription});
    this.setState({statuses});
  }

  removeCard(laneIdx, cardIdx) {
    let statuses = this.state.statuses;
    statuses[laneIdx].cards = statuses[laneIdx].cards.filter((card, idx) => idx !== cardIdx);
    this.setState({statuses});
  }

  updateCard(cardTitle, cardDescription, laneIdx, cardIdx) {
    let statuses = this.state.statuses;
    statuses[laneIdx].cards[cardIdx] = {title: cardTitle, description: cardDescription};
    this.setState({statuses});
  }

  moveCard(oldLaneIdx, newLaneIdx, oldCardIdx, newCardIdx) {
    let statuses = this.state.statuses;
    // move card to the end if no new lane index    
    if(typeof newCardIdx === 'undefined') {
      newCardIdx = statuses[newLaneIdx].cards.length;
    }
    // get card from old position
    const movingCard = statuses[oldLaneIdx].cards.splice(oldCardIdx, 1)[0];
    // move card to new position
    statuses[newLaneIdx].cards.splice(newCardIdx, 0, movingCard);
    this.setState({statuses});
  }

  render() {
    let lanes = this.state.statuses.map((status, idx, statuses) => {
      let cardMoveableDirections = {};
      cardMoveableDirections['left'] = idx === 0 ? false : true;
      cardMoveableDirections['right'] = idx === statuses.length - 1 ? false : true;
      return <Lane
        title={status.title}
        cards={status.cards}
        key={idx}
        laneIdx={idx}
        addCard={this.addCard}
        removeCard={this.removeCard}
        updateCard={this.updateCard}
        moveCard={this.moveCard}
        cardMoveableDirections={cardMoveableDirections}
        />
    })
    return(
      <div className='board'>
        <h1>{this.state.title}</h1>
        <div className='box'>
          <div className='lane-container'>
            {lanes}
          </div>
        </div>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Board);