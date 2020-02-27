import { Component } from "react";

class Textarea extends Component {

    render() {
        return (
            <>
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
            </>
        )
    }
}