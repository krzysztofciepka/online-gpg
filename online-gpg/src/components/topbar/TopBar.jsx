import React, { Component } from "react";
import { Icon, Row, Col, Button, Spin } from "antd";

export class TopBar extends Component {
  constructor(props) {
    super(props);
    const { onButtonPress, title } = this.props;

    this.title = title;
    this.onButtonPress = onButtonPress;
  }

  buttonClicked(id) {
    this.onButtonPress(id);
  }

  componentDidMount() {
    this.loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
  }

  render() {
    return (
      <header>
        <h1 className="header">
          <Icon type="container" />
          <span className="title">{this.title}</span>
        </h1>
        <Row className="row" type="flex" justify="center" gutter={[0, 100]}>
          <Col span={6}>
            <div className="menu">
              <Button
                ghost
                className="menu-button"
                onClick={() => {
                  this.buttonClicked("generate");
                }}
              >
                {this.props.loading.generate ? (
                  <Spin indicator={this.loadingIcon} />
                ) : (
                  "Generate keys"
                )}
              </Button>

              <Button
                ghost
                className="menu-button"
                onClick={() => {
                  this.buttonClicked("encrypt");
                }}
              >
                {this.props.loading.encrypt ? (
                  <Spin indicator={this.loadingIcon} />
                ) : (
                  "Encrypt"
                )}
              </Button>
              <Button
                ghost
                className="menu-button"
                onClick={() => {
                  this.buttonClicked("decrypt");
                }}
              >
                {this.props.loading.decrypt ? (
                  <Spin indicator={this.loadingIcon} />
                ) : (
                  "Decrypt"
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </header>
    );
  }
}
