import React, { Component } from "react";
import "./App.css";
import GpgManager from "gpg-manager";
import { Button, Input, Row, Col } from "antd";
const { TextArea } = Input;

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
  }

  async componentDidMount() {
    this.gpgManager = new GpgManager({ rsaKeyBits: 4096 });
  }

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
      signMessage: false,
      message: this.state.decryptedMessage
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
        <Row className="row" type="flex" justify="center" gutter={[0, 100]}>
          <Col span={6}>
            <div className="menu">
              <Button
                ghost
                className="menu-button"
                onClick={this.generateKeys.bind(this)}
              >
                Genereate keys
              </Button>
              <Button
                ghost
                className="menu-button"
                onClick={this.encrypt.bind(this)}
              >
                Encrypt
              </Button>
              <Button
                ghost
                className="menu-button"
                onClick={this.decrypt.bind(this)}
              >
                Decrypt
              </Button>
            </div>
          </Col>
        </Row>
        <Row
          className="row"
          type="flex"
          justify="space-around"
          gutter={[0, 100]}
        >
          <Col span={8}>
            <TextArea
              autoSize={{ minRows: 10, maxRows: 10 }}
              placeholder="Paste private key here"
              className="key-input"
              value={this.state.privateKey}
              onChange={evt => this.setState({ privateKey: evt.target.value })}
            ></TextArea>
          </Col>
          <Col span={8}>
            <TextArea
              autoSize={{ minRows: 10, maxRows: 10 }}
              placeholder="Paste public key here"
              className="key-input"
              value={this.state.publicKey}
              onChange={evt => this.setState({ publicKey: evt.target.value })}
            ></TextArea>
          </Col>
        </Row>
        <Row
          className="row"
          type="flex"
          justify="space-around"
          gutter={[0, 100]}
        >
          <Col span={8}>
            <TextArea
              autoSize={{ minRows: 10, maxRows: 10 }}
              placeholder="Paste plain text message here"
              className="key-input"
              value={this.state.decryptedMessage}
              onChange={evt =>
                this.setState({ decryptedMessage: evt.target.value })
              }
            ></TextArea>
          </Col>
          <Col span={8}>
            <TextArea
              autoSize={{ minRows: 10, maxRows: 10 }}
              placeholder="Paste encrypted message here"
              className="key-input"
              value={this.state.encryptedMessage}
              onChange={evt =>
                this.setState({ encryptedMessage: evt.target.value })
              }
            ></TextArea>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
