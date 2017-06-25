import React from 'react';
import Card from './card';
import CardPlaceholder from './cardPlaceholder';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { ItemTypes } from '../constants';

const cardTarget = {
  drop(props, monitor, component) {
    if(monitor.didDrop()) {
      return;
    }

    const item = monitor.getItem();
    props.moveCard(item.laneIdx, props.laneIdx,  item.cardIdx);
    
    return {moved: true};
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({shallow: true}),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}

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

  moveCard(oldLaneIdx, oldCardIdx, newCardIdx) {
    this.props.moveCard(oldLaneIdx, this.props.laneIdx, oldCardIdx, newCardIdx);
  }

  render() {
    const { isOver, canDrop, connectDropTarget } = this.props;
    let cards = this.props.cards.map((card, idx) => {
      return <Card
        title={card.title}
        description={card.description}
        key={idx}
        cardIdx={idx}
        laneIdx={this.props.laneIdx}
        removeCard={this.removeCard}
        updateCard={this.updateCard}
        moveCard={this.moveCard}
        moveableDirections={this.props.cardMoveableDirections}
        />
    });
    return connectDropTarget(
      <div className='lane'>
        <div>{this.props.title}</div>
        {cards}
        <CardPlaceholder addCard={this.addCard} />
      </div>
    )
  }
}

export default DropTarget(ItemTypes.CARD, cardTarget, collect)(Lane);
// export default Lane;