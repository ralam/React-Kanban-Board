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
          {title: 'Expand the deck', description: 'Add a new section to the deck to make room for a grill and hammock.'},
          {title: 'Plant new shrubs', description: 'Plant new shrubs by the fence.'}
        ]},
        {title: 'Design', cards: [
          {title: 'Plant a vegetable garden', description: '40 square feet with planters'},
          {title: 'Build a gazeebo', description: 'Octogonal, covered, lighted, with benches and a screen to keep out insects.'}
        ]},
        {title: 'In Progress', cards: [{title: 'Building a pool', description: '25 feet long, ranging from 3 to 5 feet deep, lighted and heated'}]},
        {title: 'Testing', cards: [{title: 'Assemble deck chairs', description: 'Need to assemble 4 plastic deck chairs from the store.'}]},
        {title: 'Done', cards: [
          {title: 'Repair the fence', description: 'Fix the sections of the fence that fell over last winter.'},
          {title: 'Build doghouse', description: 'Put together a large, waterproof doghouse for Fifo to sleep in. Should be close to door.'},
          {title: 'Redo the roof', description: 'Replace old shingles on the roof.'}
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
      return <Lane
        title={status.title}
        cards={status.cards}
        key={idx}
        laneIdx={idx}
        addCard={this.addCard}
        removeCard={this.removeCard}
        updateCard={this.updateCard}
        moveCard={this.moveCard}
        />
    })
    return(
      <div className='board'>
        <div className='header'>
          <h1>{this.state.title}</h1>
        </div>
        <div className='content'>
          <div className='lane-container'>
            {lanes}
          </div>
        </div>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Board);