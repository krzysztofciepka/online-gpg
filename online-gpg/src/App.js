import React, { Component } from "react";
import "./App.css";
import GpgManager from "gpg-manager";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Input, Row, Col, notification, Spin, Icon, Modal } from "antd";
import validator from "validator";
const { TextArea } = Input;

class App extends Component {
  constructor() {
    super();
    this.state = {
      privateKey: "",
      publicKey: "",
      encryptedMessage: "",
      decryptedMessage: "",
      passphrase: "",
      username: "test@example.com",
      email: "",
      loading_generate: false,
      loading_encrypt: false,
      loading_decrypt: false,
      generateKeysModalVisible: false
    };
  }

  async componentDidMount() {
    this.gpgManager = new GpgManager({ rsaKeyBits: 4096 });
    this.loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
  }

  showError(message) {
    this.showNotification("error", "Error", message);
  }

  showNotification(type, title, message) {
    notification[type]({
      message: title,
      description: message,
      duration: 3,
      onClick: () => {}
    });
  }

  showGenerateKeysModal() {
    this.setState({ generateKeysModalVisible: true });
  }

  hideGenerateKeysModal() {
    this.setState({ generateKeysModalVisible: false });
  }

  async generateKeys() {
    this.hideGenerateKeysModal();
    this.setState({ loading_generate: true });
    const { privateKey, publicKey } = await this.gpgManager.generateKeyPair({
      passphrase: this.state.passphrase,
      user: {
        email: this.state.email,
        name: this.state.username
      }
    });

    this.setState({ publicKey, privateKey });
    this.setState({ loading_generate: false });
  }

  async encrypt() {
    if (!this.state.publicKey) {
      return this.showError("Please provide public key");
    }

    if (!this.state.decryptedMessage) {
      return this.showError("Please provide message");
    }

    this.setState({ loading_encrypt: true });
    const encryptedMessage = await this.gpgManager.encrypt({
      publicKey: this.state.publicKey,
      signMessage: false,
      message: this.state.decryptedMessage
    });

    this.setState({ encryptedMessage });
    this.setState({ loading_encrypt: false });
  }

  async decrypt() {
    if (!this.state.privateKey) {
      return this.showError("Please provide private key");
    }

    if (!this.state.passphrase) {
      return this.showError("Please provide passphrase");
    }

    if (!this.state.encryptedMessage) {
      return this.showError("Please provide encrypted message");
    }

    this.setState({ loading_decrypt: true });
    const decryptedMessage = await this.gpgManager.decrypt({
      verify: false,
      privateKey: this.state.privateKey,
      passphrase: this.state.passphrase,
      encryptedMessage: this.state.encryptedMessage
    });

    this.setState({ decryptedMessage });
    this.setState({ loading_decrypt: false });
  }

  copyToClipboard(name) {
    this.showNotification("success", name + " copied!", "");
  }

  download(content, filename) {
    const element = document.createElement("a");
    const file = new Blob([content], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  isValidEmail(email) {
    return validator.isEmail(email);
  }

  render() {
    return (
      <div className="App">
        <h1 className="header">
          <Icon type="container" />
          <span className="title">Online PGP</span>
        </h1>
        <Row className="row" type="flex" justify="center" gutter={[0, 100]}>
          <Col span={6}>
            <div className="menu">
              <Button
                ghost
                className="menu-button"
                onClick={this.showGenerateKeysModal.bind(this)}
              >
                {this.state.loading_generate ? (
                  <Spin indicator={this.loadingIcon} />
                ) : (
                  "Generate keys"
                )}
              </Button>
              <Modal
                title="Provide key data"
                okText="Generate"
                cancelButtonProps={{ ghost: true }}
                bodyStyle={{ backgroundColor: "#333842", color: "white" }}
                visible={this.state.generateKeysModalVisible}
                onOk={this.generateKeys.bind(this)}
                okButtonProps={{
                  default: true,
                  disabled: !this.state.email || !this.state.passphrase
                }}
                okType="default"
                onCancel={this.hideGenerateKeysModal.bind(this)}
              >
                <p className="form-title">E-mail</p>
                <Input
                  placeholder="E-mail"
                  onChange={e => {
                    if (this.isValidEmail(e.target.value)) {
                      this.setState({ email: e.target.value });
                    }
                  }}
                />
                <p className="form-title">Passphrase</p>
                <Input.Password
                  placeholder="Passphrase"
                  onChange={e => this.setState({ passphrase: e.target.value })}
                />
              </Modal>
              <Button
                ghost
                className="menu-button"
                onClick={this.encrypt.bind(this)}
              >
                {this.state.loading_encrypt ? (
                  <Spin indicator={this.loadingIcon} />
                ) : (
                  "Encrypt"
                )}
              </Button>
              <Button
                ghost
                className="menu-button"
                onClick={this.decrypt.bind(this)}
              >
                {this.state.loading_decrypt ? (
                  <Spin indicator={this.loadingIcon} />
                ) : (
                  "Decrypt"
                )}
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
            <CopyToClipboard
              onCopy={() => {
                this.copyToClipboard("Private key");
              }}
              text={this.state.privateKey}
            >
              <Button className="textarea-button" ghost>
                Copy
              </Button>
            </CopyToClipboard>
            <Button
              className="textarea-button"
              ghost
              onClick={() => {
                this.download(this.state.privateKey, "private.key");
              }}
            >
              Download
            </Button>
          </Col>
          <Col span={8}>
            <TextArea
              autoSize={{ minRows: 10, maxRows: 10 }}
              placeholder="Paste public key here"
              className="key-input"
              value={this.state.publicKey}
              onChange={evt => this.setState({ publicKey: evt.target.value })}
            ></TextArea>
            <CopyToClipboard
              onCopy={() => {
                this.copyToClipboard("Public key");
              }}
              text={this.state.publicKey}
            >
              <Button className="textarea-button" ghost>
                Copy
              </Button>
            </CopyToClipboard>
            <Button
              className="textarea-button"
              ghost
              onClick={() => {
                this.download(this.state.publicKey, "public.key");
              }}
            >
              Download
            </Button>
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
            <CopyToClipboard
              onCopy={() => {
                this.copyToClipboard("Message");
              }}
              text={this.state.decryptedMessage}
            >
              <Button className="textarea-button" ghost>
                Copy
              </Button>
            </CopyToClipboard>
            <Button
              className="textarea-button"
              ghost
              onClick={() => {
                this.download(this.state.decryptedMessage, "message.txt");
              }}
            >
              Download
            </Button>
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
            <CopyToClipboard
              onCopy={() => {
                this.copyToClipboard("Encrypted message");
              }}
              text={this.state.encryptedMessage}
            >
              <Button className="textarea-button" ghost>
                Copy
              </Button>
            </CopyToClipboard>
            <Button
              className="textarea-button"
              ghost
              onClick={() => {
                this.download(this.state.encryptedMessage, "encrypted.txt");
              }}
            >
              Download
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
