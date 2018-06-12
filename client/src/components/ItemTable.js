// Copyright (c) 2018 Potato Potaato
// [This program is licensed under the "MIT License"]
// Please see the file LICENSE.md in the
// source distribution of this software for license terms.

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