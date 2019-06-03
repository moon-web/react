import React, { Component } from 'react'
import { Modal } from 'antd'
import { injectIntl } from 'react-intl'

class PictureModal extends Component {
    render() {
        let { intl, visible, showImg, pictureModalwidth } = this.props;
        return (
            <Modal
                className={pictureModalwidth ? 'picture-modal pictureModalwidth' : 'picture-modal'}
                title={intl.formatMessage({ id: "global.picture.details", defaultMessage: "图片详情", description: "图片详情" })}
                zIndex={9999}
                visible={visible}
                footer={false}
                onCancel={() => this.props.onCancel()}
                width={pictureModalwidth ? pictureModalwidth : '40%'}
            >
                <div className="picture-img-wrap">
                    <img src={showImg} alt={showImg} />
                </div>
            </Modal>
        )
    }
}

export default injectIntl(PictureModal)
