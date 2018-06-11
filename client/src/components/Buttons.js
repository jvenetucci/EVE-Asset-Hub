import React, { Component } from 'react';

class AddCharacterButton extends Component {

  render() {
    return (
      <div className="AddCharButton">
        <a href="https://login.eveonline.com/oauth/authorize?response_type=code&redirect_uri=http://localhost:3001/callback&client_id=568abab7ba4d4785b5b165db550952ac&scope=characterWalletRead%20characterAssetsRead%20esi-wallet.read_character_wallet.v1%20esi-assets.read_assets.v1">Add Character</a>
      </div>
    );
  }
}

class ResetButton extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
      event.preventDefault()
      this.props.callback()
  }

  render() {
      return(
          <form id="ResetButton" onSubmit={this.handleSubmit}>
              <input type="submit" value="Reset" />
          </form>
      )}
}

export default {AddCharacterButton, ResetButton};