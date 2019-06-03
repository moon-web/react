import React, { Component } from 'react'
import { Modal, Row, Col } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'

class ProdUrlListModal extends Component {
    // 校验Url
    checkProdUrl(url) {
        if (url) {
            let { checkUrl } = this.props;
            if (checkUrl) {
                checkUrl(url)
            }
        }
    }

    // 关闭弹窗
    handleCloseModal() {
        if (this.props.closeModal) {
            this.props.closeModal()
        }
    }

    render() {
        let { prodUrlList, visible, intl } = this.props;
        return (
            <Modal
                visible={visible}
                footer={null}
                onCancel={() => this.handleCloseModal()}
                title={intl.formatMessage({ id: 'monitor.prod.url.list', defaultMessage: '商品链接列表' })}
            >
                <div style={{height: '500px', overflow: 'auto'}}>
                    {
                        prodUrlList
                            ? prodUrlList.map(item => <Row style={{paddingBottom: '10px'}} key={item}>
                                <Col span={19}>
                                    <a href={item} target='_blank'>{item}</a>
                                </Col>
                                <Col span={5}>
                                    <a style={{ marginLeft: 15 }} onClick={() => this.checkProdUrl(item)} ><FormattedMessage id="report.verification.link" defaultMessage="验证链接" description="验证链接" /></a>
                                </Col>
                            </Row>)
                            : ''
                    }
                </div>
            </Modal>
        )
    }
}

export default injectIntl(ProdUrlListModal);