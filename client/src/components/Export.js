// Copyright (c) 2018 Potato Potaato
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE.md in the
// source distribution of this software for license terms.

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

    handleSubmit(event) {
        event.preventDefault()
        this.props.callback(this.state.option)
    }

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