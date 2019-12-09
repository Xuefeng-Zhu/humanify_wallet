import React from "react";
import PropTypes from "prop-types";
import { Modal, notification, Button } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Form from "./form";
import axios from "../utils/axios";

class CreateNameForm extends React.Component {
  constructor(props) {
    super(props);

    this.form = React.createRef();
  }

  onSubmit = () => {
    const { onClose } = this.props;

    this.form.current.validateFields((err, values) => {
      if (err) {
        return;
      }

      axios.post("name", values).then(res => {
        const { data } = res;
        const btn = (
          <CopyToClipboard
            text={data.emojis}
            onCopy={() => notification.close(data.emojis)}
          >
            <Button type="primary" size="small">
              Copy emojis to clipboard
            </Button>
          </CopyToClipboard>
        );

        notification.open({
          message: "Name created",
          description: `Your encoded private key emojis is ${data.emojis}`,
          btn,
          key: data.emojis
        });
      });
      onClose();
    });
  };

  render() {
    const { visible, onClose } = this.props;
    const formItems = [
      {
        name: "name",
        rules: [
          {
            message: "Please enter a name!",
            required: true
          }
        ]
      }
    ];

    return (
      <Modal
        title="Create Name"
        visible={visible}
        onOk={this.onSubmit}
        onCancel={onClose}
      >
        <Form ref={this.form} items={formItems} />
      </Modal>
    );
  }
}

CreateNameForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CreateNameForm;
