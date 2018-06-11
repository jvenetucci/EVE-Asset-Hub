import React, { Component } from 'react';
import './App.css';

import Buttons from './components/Buttons'
import ItemTable from './components/ItemTable'
import SearchBar from './components/SearchBar'

import axios from "axios";
import Fuse from "fuse.js"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      itemList: []
    }

    this.searchItems = this.searchItems.bind(this);
    this.getCharacters = this.getCharacters.bind(this);
    this.getItems = this.getItems.bind(this);
    this.resetItems = this.resetItems.bind(this);
  }

  async componentWillMount() {
    await this.getCharacters();
    await this.getItems();
    // this.setState(this.state);
  }

  searchItems(searchTerm) {
    var newState = this.state;
    console.log(newState)
    var options = {
      shouldSort: true,
      includeScore: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "Name",
        "Owner",
        "LocName"
      ]
    };
    var fuse = new Fuse(newState.itemList, options);
    newState.itemList = fuse.search(searchTerm);
    console.log(newState);
    this.setState(newState);
  }

  resetItems() {
    this.getItems()
  }

  render() {
    return (
      <div className="App">
        <div className="Header">
          <h1 id="title">EVE Asset Hub</h1>
        </div>

        <div className="MainContent">
          <div className="ToolBar">
            <Buttons.AddCharacterButton />
            <SearchBar callback={this.searchItems}/>
            <Buttons.ResetButton callback={this.resetItems}/>
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
    var currentState = this.state;
    currentState.characters = res.data;
    this.setState(currentState);
    // this.state.characters = res.data;
  }

  async getItems() {
    var res = await axios({
      method: 'get',
      url: '/getItems'
    })
    var currentState = this.state;
    currentState.itemList = res.data;
    this.setState(currentState);
    // this.state.itemList = res.data
  }


}

  

export default App;
