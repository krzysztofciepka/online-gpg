import React, { Component } from "react";
import "./App.css";
import GpgManager from "gpg-manager";

import { Row, Col, notification } from "antd";
import { CredentialsModal } from "./components/modal/CredentialsModal";
import { PassphraseModal } from "./components/modal/PassphraseModal";
import { TopBar } from "./components/topbar/TopBar";
import { TextField } from "./components/textfield/TextField";

class App extends Component {
  constructor() {
    super();
    this.state = {
      privateKey: "",
      publicKey: "",
      encryptedMessage: "",
      decryptedMessage: "",
      passphrase: "",
      email: "",
      loading: {
        generate: false,
        encrypt: false,
        decrypt: false
      },
      generateKeysModalVisible: false,
      passphraseModalVisible: false
    };
  }

  async componentDidMount() {
    this.gpgManager = new GpgManager({ rsaKeyBits: 4096 });
  }

  showError(message) {
    this.showNotification("error", "Error", message);
  }

  showNotification(type, title, message) {
    notification[type]({
      message: title,
      description: message,
      duration: 3
    });
  }

  async generateKeys() {
    try {
      const { privateKey, publicKey } = await this.gpgManager.generateKeyPair({
        passphrase: this.state.passphrase,
        user: {
          email: this.state.email,
          name: this.state.email
        }
      });

      this.setState({ publicKey, privateKey });
    } catch (err) {
      this.showError("Could not generate keys");
    }
  }

  async encrypt() {
    if (!this.state.publicKey) {
      return this.showError("Please provide public key");
    }

    if (!this.state.decryptedMessage) {
      return this.showError("Please provide message");
    }

    try {
      const encryptedMessage = await this.gpgManager.encrypt({
        publicKey: this.state.publicKey,
        signMessage: false,
        message: this.state.decryptedMessage
      });

      this.setState({ encryptedMessage });
    } catch (err) {
      this.showError(
        "Could not encrypt message. Check if public key is correct"
      );
    }
  }

  async decrypt() {
    if (!this.state.privateKey) {
      return this.showError("Please provide private key");
    }

    if (!this.state.encryptedMessage) {
      return this.showError("Please provide encrypted message");
    }

    try {
      const decryptedMessage = await this.gpgManager.decrypt({
        verify: false,
        privateKey: this.state.privateKey,
        passphrase: this.state.passphrase,
        encryptedMessage: this.state.encryptedMessage
      });

      this.setState({ decryptedMessage });
    } catch (err) {
      console.log(err);
      this.showError(
        "Could not decrypt message. Check if provided data is correct"
      );
    }
  }

  async onGenerateKeysModalOk(data) {
    this.setState({
      email: data.email,
      passphrase: data.passphrase,
      generateKeysModalVisible: false,
      loading: {
        generate: true
      }
    });

    await this.generateKeys();

    this.setState({
      loading: {
        generate: false
      }
    });
  }

  onGenerateKeysModalCancel() {
    this.setState({
      generateKeysModalVisible: false
    });
  }

  onPassphraseModalOk(data) {
    this.setState({
      passphrase: data.passphrase,
      passphraseModalVisible: false
    });
  }

  onPassphraseModalCancel() {
    this.setState({
      passphraseModalVisible: false
    });
  }

  onGenerateButtonPress() {
    this.setState({ generateKeysModalVisible: true });
  }

  async onEcryptButtonPress() {
    this.setState({
      loading: {
        encrypt: true
      }
    });
    await this.encrypt();
    this.setState({
      loading: {
        encrypt: false
      }
    });
  }

  async onDecryptButtonPress() {
    this.setState({
      loading: {
        decrypt: true
      }
    });
    await this.decrypt();
    this.setState({
      loading: {
        decrypt: false
      }
    });
  }

  onTopBarButtonPress(id) {
    switch (id) {
      case "generate":
        this.onGenerateButtonPress();
        break;
      case "encrypt":
        this.onEcryptButtonPress();
        break;
      case "decrypt":
        this.onDecryptButtonPress();
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className="App">
        <TopBar
          title="Online PGP"
          onButtonPress={this.onTopBarButtonPress.bind(this)}
          loading={this.state.loading}
        ></TopBar>
        <CredentialsModal
          visible={this.state.generateKeysModalVisible}
          onOk={this.onGenerateKeysModalOk.bind(this)}
          onCancel={this.onGenerateKeysModalCancel.bind(this)}
        ></CredentialsModal>
        <PassphraseModal
          visible={this.state.passphraseModalVisible}
          onOk={this.onPassphraseModalOk.bind(this)}
          onCancel={this.onPassphraseModalCancel.bind(this)}
        ></PassphraseModal>
        <Row
          className="row"
          type="flex"
          justify="space-around"
          gutter={[0, 100]}
        >
          <Col span={8}>
            <TextField
              name="Private key"
              placeholder="Paste private key here"
              filename="private.key"
              text={this.state.privateKey}
              onChange={data => {
                this.setState({ privateKey: data.value });
              }}
            ></TextField>
          </Col>
          <Col span={8}>
            <TextField
              name="Public key"
              placeholder="Paste public key here"
              filename="public.key"
              text={this.state.publicKey}
              onChange={data => {
                this.setState({ publicKey: data.value });
              }}
            ></TextField>
          </Col>
        </Row>
        <Row
          className="row"
          type="flex"
          justify="space-around"
          gutter={[0, 100]}
        >
          <Col span={8}>
            <TextField
              name="Message"
              placeholder="Paste message here"
              filename="message.txt"
              text={this.state.decryptedMessage}
              onChange={data => {
                this.setState({ decryptedMessage: data.value });
              }}
            ></TextField>
          </Col>
          <Col span={8}>
            <TextField
              name="Encrypted message"
              placeholder="Paste encrypted message here"
              filename="encrypted.gpg"
              text={this.state.encryptedMessage}
              onChange={data => {
                this.setState({ encryptedMessage: data.value });
              }}
            ></TextField>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
