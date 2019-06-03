import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import {  Modal, Form, Row, Input } from 'antd'

class GiveUpModal extends Component {
    constructor() {
        super();
        this.state = {
        }
    }

    //提交信息
    handleOk() {
        if(this.props.handleOk){
            this.props.handleOk()
        }
    }

    //取消提交信息
    handleCancel() {
        if(this.props.handleCancel){
            this.props.handleCancel()
        }
    }

    //赋值
    handleChange(value, type) {
        if(this.props.handleChange){
            this.props.handleChange(value, type)
        }
    }

    render() {
        let { visible, reason, intl, editType } = this.props;
        return (
            <Modal
                title={ 
                    editType === 2 ? 
                        intl.formatMessage({ id: 'monitor.fail.reason', defaultMessage: "不通过理由" }) : 
                        intl.formatMessage({ id: 'offline.case.give.up.reason', defaultMessage: "放弃理由" })
                     }
                visible={visible}
                onOk={()=>this.handleOk()}
                onCancel={()=>this.handleCancel()}
                className="root"
            >
                <div className="search-form">
                    <Row>
                        <Form.Item label={
                                    editType === 2 ? 
                                    intl.formatMessage({ id: 'monitor.fail.reason', defaultMessage: "不通过理由" }) : 
                                    intl.formatMessage({ id: 'offline.case.give.up.reason', defaultMessage: "放弃理由" })
                                }>
                            <Input
                                placeholder={
                                    editType === 2 ? 
                                    intl.formatMessage({ id: 'monitor.please.enter.fail.reason', defaultMessage: '请输入不通过理由' }) : 
                                    intl.formatMessage({ id: 'offline.case.please.enter.give.up.reason', defaultMessage: '请输入放弃理由' })
                                }
                                onChange={(e) => this.handleChange(e.target.value.trim(), 'reason')}
                                value={reason}
                            />
                        </Form.Item>
                    </Row>
                </div>
            </Modal>
        )
    }
}

export default injectIntl(GiveUpModal);