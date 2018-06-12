// Copyright (c) 2018 Potato Potaato
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE.md in the
// source distribution of this software for license terms.

// This file contains the definitions for the component that
//  lets the user search through the asset list

import React, { Component } from 'react';

class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // If the button is pushed, call the function
    //  searchItems() in App.js
    // Passes the contents of search bar
    handleSubmit(event) {
        event.preventDefault()
        this.props.callback(this.state.value)
    }

    // Update the state to reflect what the search bar contains.
    handleChange(event) {
        this.setState({value: event.target.value})
    }

    render() {
        return(
            <form id="SearchBar" onSubmit={this.handleSubmit}>
                <label>Name: </label><input value={this.state.value} onChange={this.handleChange} type="text" />
                <input id="SearchButton" type="submit" value="Search" />
            </form>
        );
    }
}

export default SearchBar;