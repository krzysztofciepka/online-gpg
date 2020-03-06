import React, { Component } from "react";
import { Input, Button, notification } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";

const { TextArea } = Input;

export class TextField extends Component {
  copyToClipboard() {
    this.showNotification("success", this.props.name + " copied!", "");
  }

  showNotification(type, title, message) {
    notification[type]({
      message: title,
      description: message,
      duration: 3
    });
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

  render() {
    return (
      <div>
        <TextArea
          autoSize={{ minRows: 10, maxRows: 10 }}
          placeholder={this.props.placeholder}
          className="key-input"
          value={this.props.text}
          onChange={evt => {
            this.props.onChange({ value: evt.target.value });
          }}
        ></TextArea>
        <CopyToClipboard
          onCopy={() => {
            this.copyToClipboard();
          }}
          text={this.props.text}
        >
          <Button className="textarea-button" ghost>
            Copy
          </Button>
        </CopyToClipboard>
        <Button
          className="textarea-button"
          ghost
          onClick={() => {
            this.download(
              this.props.text,
              this.props.filename || this.props.name
            );
          }}
        >
          Download
        </Button>
      </div>
    );
  }
}
