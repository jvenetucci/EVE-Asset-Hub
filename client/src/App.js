import React, { Component } from 'react';
import './App.css';
import AddCharacterButton from './buttons'
import ItemTable from './components/ItemTable'
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      itemList: []
    }
  }

  async componentWillMount() {
    await this.getCharacters();
    await this.getItems();
    this.setState(this.state);
  }

  render() {
    return (
      <div className="App">
        <AddCharacterButton />
        <ItemTable itemList={this.state.itemList}/>
      </div>
    );
  }

  async getCharacters() {
    var res = await axios({
        method: 'get',
        url: '/getCharacters'
    })
    this.state.characters = res.data;
  }

  async getItems() {
    var res = await axios({
      method: 'get',
      url: '/getItems'
  })
  this.state.itemList = (res.data)
  }
}

  

export default App;
