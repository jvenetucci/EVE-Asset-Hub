import React, { Component } from 'react';
import Item from './Item';

class ItemTable extends Component {

  render() {
    var indexCount = -1;

    return (
      <div className="ItemTable">
        <table>
          <tbody>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Location Name</th>
              <th>Location Flag</th>
              <th>Location Type</th>
              <th>Owner</th>
            </tr>
            {this.props.itemList.map(item => (<Item key={++indexCount} item={item}/>))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ItemTable;