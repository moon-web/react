import React, { Component } from 'react';
import { Form, Input, Row, Col, Select, Modal } from 'antd';
import { injectIntl } from 'react-intl';
const Option = Select.Option;
const { TextArea } = Input;
class BindModal extends Component {
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
	//select选择事件
	//输入框事件
	bindModalChange(value, type) {
		if (this.props.bindModalChange) {
			this.props.bindModalChange(value, type)
		}
	}


	render() {
		let { intl, bindVisible, bindBrand, bindBrandData } = this.props
		return (
			<Modal
				className="root"
				title={intl.formatMessage({ id: "complaint.bind.account.role", defaultMessage: "关联品牌商", description: "关联品牌商" })}
				visible={bindVisible}
				onOk={() => this.props.onOk()}
				onCancel={() => this.props.onCancel()}
			>
				<div className="search-form">
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.user.name", defaultMessage: "用户名", description: "用户名" })}>
								<Input placeholder={intl.formatMessage({ id: "system.please.enter.user.name", defaultMessage: "请输入用户名", description: "请输入用户名" })}
									onChange={(e) => this.bindModalChange(e.target.value.trim(), 'userName')} value={bindBrandData.userName} disabled/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "brand.interaction.brand.owner", defaultMessage: "所属品牌商", description: "所属品牌商" })}>
								<Select
									value={bindBrandData.userId}
									onChange={(value) => this.bindModalChange(value, 'userId')}
									placeholder={intl.formatMessage({ id: "brand.olease.choose.interaction.brand.owner", defaultMessage: "请选择所属品牌商", description: "请选择所属品牌商" })}
									dropdownMatchSelectWidth={ true }
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
									{
                                        bindBrand && bindBrand.map(opt => <Option key={opt.userId} value={opt.userId}>{opt.userName}</Option>)
                                    }									
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</div>
			</Modal>
		)
	}
}
export default injectIntl(BindModal)