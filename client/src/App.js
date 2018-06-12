// Copyright (c) 2018 Potato Potaato
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE.md in the
// source distribution of this software for license terms.

import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import Fuse from "fuse.js";
import json2csv from "json2csv";

// Import of components used to build the entire app
import Buttons from './components/Buttons'
import ItemTable from './components/ItemTable'
import SearchBar from './components/SearchBar'
import Export from './components/Export'

// Here is the main Component of the Web App.
// This component holds the current list of characters and asset list.
// It passes down state to smaller components when neccessary
// The filterList in state contains what the user currently sees.
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
    this.exportCSV = this.exportCSV.bind(this);
  }

  // This happens everytime the app is going to be re rendered.
  // basically if you refresh the page, this grabs the current characters and assets from server
  async componentWillMount() {
    await this.getCharacters();
    await this.getItems();
  }

  // The main render method that builds the page.
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
              <Buttons.RefreshButton callback={this.getItems}/>
            </div>
            <Export callback={this.exportCSV} />
          </div>
          <ItemTable filterList={this.state.filterList}/>
          {this.refreshButtonMessage()}
        </div>

        <div className="Footer">
          Potato Potaato - 2018 - Licensed under the MIT License
        </div>
      </div>
    );
  }

  // This function is tied to the Search Bar and Button
  // Takes in a term, uses fuse.js to apply that term to the itemList
  //  then stores the result in the filterList.
  searchItems(searchTerm) {
    var searchOptions = {
      shouldSort: true,
      tokenize: true,
      threshold: 0.1,
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
    var newState = this.state;
    var fuse = new Fuse(newState.itemList, searchOptions);
    newState.filterList = fuse.search(searchTerm);
    this.setState(newState);
  }

  // This function is tied to the Reset Button
  // Sets the filterList (what the user sees) to be equal to the itemList
  resetItems() {
    var newState = this.state;
    newState.filterList = newState.itemList;
    this.setState(newState);
  }

  // This function is tied to the Export Button
  // Takes in a string representing "true" or "false"
  // If the string is "true" generate a CVS file from itemList (all items)
  // Otherwise generate the file from filterList (the current view)
  // Automatically downloads the file through the browser.
  exportCSV(option) {
    var csv = null;
    var fields = [{
        label: "Item",
        value: "Name"
      }, 'Quantity', 'LocName', 'LocFlag', 'LocType', 'Owner'
    ];

    try {
      if (option === 'true') {
        csv = (json2csv.parse(this.state.itemList, {fields}))
      } else {
        csv = (json2csv.parse(this.state.filterList, {fields}))
      }
  
      // Create a link to download the CVS and automatically click it to auto download
      var link = document.createElement('a');
      link.setAttribute('href', 'data:text/csv;charset=ETF-8,' + encodeURI(csv));
      link.setAttribute('download', 'assets');
      link.click();
    } catch (err) {
      alert("Error trying to create CSV. See console for details");
      console.log(err);
    }
  }

  // This function will return a message to the user in case the
  //  server hasn't finished translating the asset list.
  // This checks to see if there are characters in the list but no assets.
  // Generally this will only hold true on the first character you add.
  refreshButtonMessage() {
    if (((this.state.characters.length > 0) && (this.state.itemList.length === 0))) {
      return (
        <p>Just added a character but see no assets? Wait a few seconds and then push the Refresh button!</p>
      )
    } else return null
  }

  // Grabs the current character list from the server and updates state
  async getCharacters() {
    var res = await axios({
        method: 'get',
        url: '/getCharacters'
    })
    var currentState = this.state;
    currentState.characters = res.data;
    this.setState(currentState);
  }

  // Grabs the current asset list from the server and updates state.
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