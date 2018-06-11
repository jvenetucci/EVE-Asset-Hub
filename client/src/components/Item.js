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