import React, { Component } from 'react'
import { Modal, Input } from 'antd'
import { injectIntl } from 'react-intl'
const { TextArea } = Input;

class CookieModal extends Component {
    render() {
        let { intl, visible, modalCookie } = this.props;
        return (
            <Modal
                className="picture-modal"
                title={intl.formatMessage({ id: "system.cookie.detail", defaultMessage: "Cookie详情", description: "Cookie详情" })}
                zIndex={9999}
                visible={visible}
                footer={false}
                onCancel={() => this.props.onCancel()}
            >
                <div>
                    <TextArea disabled rows={18} value={modalCookie}></TextArea>
                </div>
            </Modal>
        )
    }
}

export default injectIntl(CookieModal)
