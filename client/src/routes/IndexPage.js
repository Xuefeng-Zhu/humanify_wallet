import React from "react";
import { connect } from "dva";
import { Card, Row, Col, Button, Input, Result } from "antd";

import CreateNameForm from "../components/create-name";
import axios from "../utils/axios";

import styles from "./IndexPage.css";

const { Search } = Input;

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNameModalVisible: false
    };
  }

  toggleCreateNameModal = () => {
    this.setState(prevState => ({
      isNameModalVisible: !prevState.isNameModalVisible
    }));
  };

  handleSearch = value => {
    const params = {
      emojis: value
    };
    axios
      .get("name", { params })
      .then(res => {
        const { data } = res;
        this.setState({
          name: data.name,
          error: undefined
        });
      })
      .catch(error => {
        this.setState({
          error: error.response.data,
          name: undefined
        });
      });
  };

  render() {
    const { isNameModalVisible, name, error } = this.state;
    let result;

    if (error) {
      result = <Result status="error" title={error} />;
    }

    if (name) {
      result = <Result status="success" title={`The name is ${name}`} />;
    }

    return (
      <Card
        title="Humanify Wallet"
        extra={
          <Button type="primary" onClick={this.toggleCreateNameModal}>
            Create Name
          </Button>
        }
      >
        <Row style={{ marginTop: "10px" }}>
          <Col span={12}>
            <Search
              placeholder="Please enter encoded emojis"
              enterButton="Query Name"
              size="large"
              onSearch={this.handleSearch}
            />
            {result}
          </Col>
        </Row>

        <CreateNameForm
          visible={isNameModalVisible}
          onClose={this.toggleCreateNameModal}
        />
      </Card>
    );
  }
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
