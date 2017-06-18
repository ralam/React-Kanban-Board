import React from 'react';
import Card from './card';

class Lane extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    let cards = this.props.cards.map((card, idx) => {
      return <Card
        title={card.title}
        description={card.description}
        key={idx}
        />
    })
    return(
      <div className='lane'>
        <div>{this.props.title}</div>
        {cards}
      </div>
    )
  }
}

export default Lane;