import { Component } from "react";

class Header extends Component {

    render() {
        return (
            <>
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
                                onClick={() => {
                                    if (this.state.passphrase) {
                                        this.decrypt();
                                    } else {
                                        this.showPassphraseModal();
                                    }
                                }}
                            >
                                {this.state.loading_decrypt ? (
                                    <Spin indicator={this.loadingIcon} />
                                ) : (
                                        "Decrypt"
                                    )}
                            </Button>
                            <Modal
                                title="Provide passphrase"
                                okText="Set"
                                cancelButtonProps={{ ghost: true }}
                                bodyStyle={{ backgroundColor: "#333842", color: "white" }}
                                visible={this.state.passphraseModalVisible}
                                onOk={this.decrypt.bind(this)}
                                okButtonProps={{
                                    default: true,
                                    disabled: !this.state.passphrase
                                }}
                                okType="default"
                                onCancel={this.hidePassphraseModal.bind(this)}
                            >
                                <p className="form-title">Passphrase</p>
                                <Input.Password
                                    placeholder="Passphrase"
                                    onChange={e => this.setState({ passphrase: e.target.value })}
                                />
                            </Modal>
                        </div>
                    </Col>
                </Row>
            </>)
    }
}