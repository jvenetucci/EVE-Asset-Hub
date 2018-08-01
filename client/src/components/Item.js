// Copyright (c) 2018 Joseph Venetucci
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE.md in the
// source distribution of this software for license terms.

// This file contains the definitions for the component that transforms
//  a JSON asset into a table row representation.

import React, { Component } from 'react';

class Item extends Component {

    render() {
        if (this.props.item !== undefined) {
            return(
                <tr className='Item'>
                    <td>{this.props.item.Name}</td>
                    <td>{this.props.item.Quantity}</td>
                    <td>{this.props.item.LocName}</td>
                    <td>{this.props.item.LocFlag}</td>
                    <td>{this.props.item.LocType}</td>
                    <td>{this.props.item.Owner}</td>
                </tr>
            )
        } else {
            return null;
        }
    }
}


export default Item;