import React from 'react';
import Lane from './lane';

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
        {title: 'In Progress', cards: [{title: 'Card 3', description: 'lorem ipsum'}]},
        {title: 'Done', cards: [
          {title: 'Card 4', description: 'bananas'},
          {title: 'Card 5', description: 'oranges'},
          {title: 'Card 6', description: 'apples'}
        ]}
      ]
    }
  }

  render() {
    let lanes = this.state.statuses.map((status, idx) => {
      return <Lane
        title={status.title}
        cards={status.cards}
        key={idx}
        />
    })
    return(
      <div className='board'>
        <h1>{this.state.title}</h1>
        {lanes}
      </div>
    )
  }
}

export default Board;