// Copyright (c) 2018 Potato Potaato
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE.md in the
// source distribution of this software for license terms.

// This file contains the definitions for the component that
//  lets the user export the table to csv


import React, { Component } from 'react';

class Export extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: "false"
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // If the button is pushed, call the function
    //  exportCVS() in App.js
    // Passes the option of current or full view
    handleSubmit(event) {
        event.preventDefault()
        this.props.callback(this.state.option)
    }

    // Update the state to reflect which radio button is currently pushed.
    handleChange(event) {
        this.setState({
            option: event.target.value
        })
    }

    render() {
        return(
            <form id="Export" onSubmit={this.handleSubmit}>
                <input id="ExportButton" type="submit" value="Export to CSV" />
                <label>
                    Current View
                    <input type="radio" value={false} onChange={this.handleChange} checked={this.state.option === "false"}/>
                </label>
                <label>
                    All Items
                    <input type="radio" value={true} onChange={this.handleChange} checked={this.state.option === "true"}/>
                </label>
            </form>
        );
    }
}


export default Export;