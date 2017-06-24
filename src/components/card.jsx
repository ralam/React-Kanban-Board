import React from 'react';
import MoveButtons from './moveButtons';
import PropTypes from 'prop-types';
import { ItemTypes } from '../constants';
import { DragSource } from 'react-dnd';

var cardSource = {
  beginDrag(props) {
    return {
      cardIdx: props.cardIdx,
      laneIdx: props.laneIdx
    };
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
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
    const { connectDragSource, isDragging } = this.props;
    if(this.state.editable) {
      return connectDragSource(
        <div className='card'>
          <input
            type='text'
            value={this.state.title}
            onChange={this.handleUpdate.bind(null, 'title')}
            />
          <input
            type='text'
            value={this.state.description}
            onChange={this.handleUpdate.bind(null, 'description')}
            />
          <button onClick={this.saveCard}>Save</button>
          <button onClick={this.toggleEditable}>Cancel</button>
        </div>
      )
    } else {
      return connectDragSource(
        <div className='card'>
          <div className='card-icon-container'>
            <div className='icon' onClick={this.deleteCard}>x</div>
            <div className='icon' onClick={this.toggleEditable}>e</div>
          </div>
          <div>{this.props.title}</div>
          <div>{this.props.description}</div>
          <MoveButtons
            moveableDirections={this.props.moveableDirections}
            moveCard={this.moveCard}
            />
        </div>
      );
    }
  }
}

Card.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

// export default Card;
export default DragSource(ItemTypes.CARD, cardSource, collect)(Card);