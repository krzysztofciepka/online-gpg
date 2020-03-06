import React, { Component } from "react";
import { Modal, Input } from "antd";
import validator from "validator";

export class CredentialsModal extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    const { onOk, onCancel } = this.props;

    this.onOk = onOk;
    this.onCancel = onCancel;
    this.state = { email: "", passphrase: "" };
  }

  isValidEmail(email) {
    return validator.isEmail(email);
  }

  okPressed() {
    this.onOk({
      email: this.state.email,
      passphrase: this.state.passphrase
    });
  }

  cancelPressed() {
    this.onCancel();
  }

  render() {
    return (
      <Modal
        title="Provide key data"
        okText="Generate"
        cancelButtonProps={{ ghost: true }}
        bodyStyle={{ backgroundColor: "#333842", color: "white" }}
        visible={this.props.visible}
        onOk={this.okPressed.bind(this)}
        okButtonProps={{
          default: true,
          disabled: !this.state.email || !this.state.passphrase
        }}
        okType="default"
        onCancel={this.cancelPressed.bind(this)}
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
    );
  }
}
