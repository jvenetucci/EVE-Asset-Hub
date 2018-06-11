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
      itemList: [],
      filterList: null
    }

    this.searchItems = this.searchItems.bind(this);
    this.getCharacters = this.getCharacters.bind(this);
    this.getItems = this.getItems.bind(this);
    this.resetItems = this.resetItems.bind(this);
    this.refreshItems = this.refreshItems.bind(this);
  }

  async componentWillMount() {
    await this.getCharacters();
    await this.getItems();
  }

  searchItems(searchTerm) {
    var newState = this.state;
    var options = {
      shouldSort: true,
      includeScore: false,
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
    newState.filterList = fuse.search(searchTerm);
    this.setState(newState);
  }

  resetItems() {
    var newState = this.state;
    newState.filterList = newState.itemList;
    this.setState(newState);
  }

  refreshItems() {
    this.getItems();
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
            <div id="ToolBarSearch">
              <SearchBar callback={this.searchItems}/>
              <Buttons.ResetButton callback={this.resetItems}/>
              <Buttons.RefreshButton callback={this.refreshItems}/>
            </div>
          </div>
          <ItemTable filterList={this.state.filterList}/>
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
  }

  async getItems() {
    var res = await axios({
      method: 'get',
      url: '/getItems'
    })
    var currentState = this.state;
    currentState.itemList = res.data;
    currentState.filterList = currentState.itemList;
    this.setState(currentState);
  }


}

  

export default App;
