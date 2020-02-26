import React, { Component } from "react";
import "./App.css";
import GpgManager from "gpg-manager";

class App extends Component {
  constructor() {
    super();
    this.state = {
      privateKey: "",
      publicKey: "",
      encryptedMessage: "",
      decryptedMessage: "",
      passphrase: "test",
      username: "AA",
      email: "test@example.com"
    };

    this.gpgManager = new GpgManager({ rsaKeyBits: 4096 });
  }

  async componentDidMount() {}

  async generateKeys() {
    const { privateKey, publicKey } = await this.gpgManager.generateKeyPair({
      passphrase: this.state.passphrase,
      user: {
        email: this.state.email,
        name: this.state.username
      }
    });

    this.setState({ publicKey, privateKey });
  }

  async encrypt() {
    const encryptedMessage = await this.gpgManager.encrypt({
      publicKey: this.state.publicKey,
      signMessage: false
    });

    this.setState({ encryptedMessage });
  }

  async decrypt() {
    const decryptedMessage = await this.gpgManager.decrypt({
      verify: false,
      privateKey: this.state.privateKey,
      passphrase: this.state.passphrase,
      encryptedMessage: this.state.encryptedMessage
    });

    this.setState({ decryptedMessage });
  }

  render() {
    return (
      <div className="App">
        <header className="menu">
          <button
            className="menu-button"
            onClick={this.generateKeys.bind(this)}
          >
            Genereate keys
          </button>
          <button className="menu-button" onClick={this.encrypt.bind(this)}>
            Encrypt
          </button>
          <button className="menu-button" onClick={this.decrypt.bind(this)}>
            Decrypt
          </button>
        </header>
        <textarea
          placeholder="Paste private key here"
          className="key-input"
          value={this.state.privateKey}
          onChange={evt => this.setState({ privateKey: evt.target.value })}
        ></textarea>
        <textarea
          placeholder="Paste public key here"
          className="key-input"
          value={this.state.publicKey}
          onChange={evt => this.setState({ publicKey: evt.target.value })}
        ></textarea>
        <textarea
          placeholder="Paste plain text message here"
          className="key-input"
          value={this.state.decryptedMessage}
          onChange={evt =>
            this.setState({ decryptedMessage: evt.target.value })
          }
        ></textarea>
        <textarea
          placeholder="Paste encrypted message here"
          className="key-input"
          value={this.state.encryptedMessage}
          onChange={evt =>
            this.setState({ encryptedMessage: evt.target.value })
          }
        ></textarea>
      </div>
    );
  }
}

export default App;
