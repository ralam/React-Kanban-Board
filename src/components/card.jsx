import React from 'react';
import { ItemTypes } from '../constants';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

const cardSource = {
  beginDrag(props) {
    return {
      cardIdx: props.cardIdx,
      laneIdx: props.laneIdx
    };
  }
}

const cardTarget = {
  drop(props, monitor, component) {
    const { cardIdx: dragIdx, laneIdx } = monitor.getItem();
    const hoverIdx = props.cardIdx;

    props.moveCard(laneIdx, dragIdx, hoverIdx);
  }
}

function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

class Card extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      title: '',
      description: ''
    }
    this.deleteCard = this.deleteCard.bind(this);
    this.saveCard = this.saveCard.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.moveCard = this.moveCard.bind(this);
  }

  deleteCard(e) {
    this.props.removeCard(this.props.cardIdx);
  }

  saveCard(e) {
    this.props.updateCard(this.state.title, this.state.description);
    this.toggleEditable();
  }

  toggleEditable(e) {
    this.setState({
      editable: !this.state.editable,
      title: this.props.title,
      description: this.props.description
    });
  }

  handleUpdate(name, e) {
    this.setState({[name]: e.currentTarget.value});
  }

  moveCard(direction) {
    this.props.moveCard(direction, this.props.cardIdx);
  }

  render() {
    const { connectDragSource, isDragging, connectDropTarget } = this.props;
    if(this.state.editable) {
      return(
        <div className='card'>
          <div className='card-title'><input
            type='text'
            value={this.state.title}
            onChange={this.handleUpdate.bind(null, 'title')}
            /></div>
          <div className='card-content'><textarea
            value={this.state.description}
            onChange={this.handleUpdate.bind(null, 'description')}
            /></div>
          <button onClick={this.saveCard}>Save</button>
          <button onClick={this.toggleEditable}>Cancel</button>
        </div>
      )
    } else {
      return connectDragSource(connectDropTarget(
        <div className='card'>
          <div className='card-icon-container'>
            <div className='icon icon--delete' onClick={this.deleteCard}></div>
            <div className='icon icon--edit' onClick={this.toggleEditable}></div>
          </div>
          <div className='card-title'>{this.props.title}</div>
          <div className='card-content'>{this.props.description}</div>
        </div>
      ));
    }
  }
}

Card = DropTarget(ItemTypes.CARD, cardTarget, dropCollect)(Card);
Card = DragSource(ItemTypes.CARD, cardSource, dragCollect)(Card);
export default Card;