import React, { Component } from 'react';
import Item from './Item';

class ItemTable extends Component {

  render() {
      if (this.props.itemList) {
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
                {this.props.itemList.map(((item, index) => (<Item key={index} item={item}/>)))}
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