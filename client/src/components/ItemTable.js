// Copyright (c) 2018 Joseph Venetucci
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE.md in the
// source distribution of this software for license terms.


// This file contains the definitions for the component that makes up the asset list table

import React, { Component } from 'react';
import Item from './Item';

class ItemTable extends Component {
  render() {
      if (this.props.filterList) {
        return (
          <div>
            <table className="ItemTable">
              <tbody>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Location Name</th>
                  <th>Location Flag</th>
                  <th>Location Type</th>
                  <th>Owner</th>
                </tr>
                {/* The code below takes each item and creates a table row out of it using Item.js */}
                {this.props.filterList.map((item => (<Item key={item.UID} item={item}/>)))}
              </tbody>
            </table>
          </div>
        );
      } else {
        return null
      }
  }
}

export default ItemTable;