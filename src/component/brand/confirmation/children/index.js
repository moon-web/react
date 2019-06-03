import React, { Component } from 'react';
import { Form, Row, Col, Modal, Radio, Input } from 'antd';
import { injectIntl } from 'react-intl';
const RadioGroup = Radio.Group;
class CheckStatus extends Component {
    constructor() {
        super()
        this.state = {
        }
    }
    //确定
    onOk() {
        if (this.props.onOk) {
            this.props.onOk()
        }
    }
    //取消
    onCancel() {
        if (this.props.onCancel) {
            this.props.onCancel()
        }
	}
	//品牌确认类型
	checkStatusChange(value,type) {
		if(this.props.checkStatusChange) {
			this.props.checkStatusChange(value,type)
		}
	}

    render() {
        let { intl, checkStatusModal, checkStatusType, auditReason } = this.props
        return (
            <Modal
                className="root"
                title={intl.formatMessage({ id: 'brand.confirmation.audit', defaultMessage: '品牌确认审核', description: '品牌确认审核' })}
                visible={checkStatusModal}
                onOk={() => this.props.onOk()}
                onCancel={() => this.props.onCancel()}
            >
                <div className="search-form">
                    <Row>
                        <Col span={24}>
							<Form.Item label={intl.formatMessage({ id: "brand.confirmation.audit", defaultMessage: "品牌确认审核", description: "品牌确认审核" })}>
                                <RadioGroup onChange={(e) => this.checkStatusChange(e.target.value,'checkStatusType')} value={checkStatusType}>
									<Radio value={4}>审核通过</Radio>
									<Radio value={3}>审核不通过</Radio>
									<Radio value={5}>异常处理</Radio>
								</RadioGroup>
							</Form.Item>
                        </Col>
                    </Row>
					{
						checkStatusType === 3 ?
							<Row>
								<Col span={24}>
									<Form.Item label={intl.formatMessage({ id: "brand.no.excuse", defaultMessage: "不通过理由", description: "不通过理由" })}>
										<Input placeholder={intl.formatMessage({id:'brand.please.no.excuse', defaultMessage: '请输入不通过理由', description: '请输入不通过理由'})} 
                                            value={auditReason} onChange={(e) => this.checkStatusChange(e.target.value.trim(),'auditReason')}
                                        />
									</Form.Item>
								</Col>
							</Row> : ''
					}
					{
						checkStatusType === 5 ?
							<Row>
								<Col span={24}>
									<Form.Item label={intl.formatMessage({ id: "brand.exception.handling.excuse", defaultMessage: "异常处理理由", description: "异常处理理由" })}>
										<Input placeholder={intl.formatMessage({id:'brand.please.exception.handling.excuse', defaultMessage: '请输入异常处理理由', description: '请输入异常处理理由'})} 
                                            value={auditReason} onChange={(e) => this.checkStatusChange(e.target.value.trim(),'auditReason')}
                                        />
									</Form.Item>
								</Col>
							</Row> : ''
					}					
                </div>
            </Modal>
        )
    }
}
export default injectIntl(CheckStatus)