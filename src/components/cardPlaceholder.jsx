import React from 'react';

class CardPlaceholder extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      cardTitle: '',
      cardDescription: ''
    }
    this.toggleForm = this.toggleForm.bind(this);
    this.updateText = this.updateText.bind(this);
    this.saveCard = this.saveCard.bind(this);
  }

  toggleForm(e) {
    this.setState({active: !this.state.active});
  }

  updateText(name, e) {
    this.setState({[name]: e.currentTarget.value});
  }

  saveCard(e) {
    this.props.addCard(this.state.cardTitle, this.state.cardDescription);
    this.setState({active: false, cardTitle: '', cardDescription: ''});
  }

  render(){
    if(this.state.active) {
      return(
        <div className='card card--placeholder card--placeholder-active'>
          <input
            type='text'
            placeholder='Title'
            value={this.state.cardTitle}
            onChange={this.updateText.bind(null, 'cardTitle')}
          />
          <textarea
            placeholder='Description'
            value={this.state.cardDescription}
            onChange={this.updateText.bind(null, 'cardDescription')}
          />
          <button onClick={this.saveCard}>Save</button>
          <button onClick={this.toggleForm}>Cancel</button>
        </div>
      );
    } else {
      return <div className='card card--placeholder card--placeholder-inactive' onClick={this.toggleForm}>+</div>
    }
  }

}

export default CardPlaceholder;