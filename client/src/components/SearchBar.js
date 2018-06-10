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

    handleSubmit(event) {
        event.preventDefault()
        this.props.callback(this.state.value)
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }
    render() {
        return(
            <form id="SearchBar" onSubmit={this.handleSubmit}>
                <label>Item Name: </label><input value={this.state.value} onChange={this.handleChange} type="text" />
                <input type="submit" value="Search" />
            </form>
        );
    }
}


export default SearchBar;