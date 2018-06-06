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
    this.render();
  }

  render() {
    return (
      <div className="App">
        <div className="Header">
          <h1 id="title">EVE Asset Hub</h1>
        </div>

        <div className="MainContent">
          <div className="ToolBar">
            <AddCharacterButton />
          </div>
          <ItemTable itemList={this.state.itemList}/>
        </div>

        <div className="Footer">
          Potato Potaato - 2018 - Licensed under the MIT License
        </div>
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
