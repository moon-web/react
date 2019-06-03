import React, { Component } from 'react';
import { Form, Input, Row, Col, Select, Modal, Checkbox } from 'antd';
import { injectIntl } from 'react-intl';
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input;
class AddUser extends Component {
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
	addModalChange(value, type) {
		if (this.props.addModalChange) {
			this.props.addModalChange(value, type)
		}
	}


	render() {
		let { intl, visible, platfromList, addComplaintAccount, edit } = this.props
		let title = ''
		if (edit) {
			title = intl.formatMessage({ id: 'global.add', defaultMessage: '新增', description: '新增' })
		} else {
			title = intl.formatMessage({ id: 'global.edit', defaultMessage: '编辑', description: '编辑' })
		}
		return (
			<Modal
				className="root"
				title={title}
				visible={visible}
				onOk={() => this.props.onOk()}
				onCancel={() => this.props.onCancel()}
			>
				<div className="search-form">
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.user.name", defaultMessage: "用户名", description: "用户名" })}>
								<Input placeholder={intl.formatMessage({ id: "system.please.enter.user.name", defaultMessage: "请输入用户名", description: "请输入用户名" })}
									onChange={(e) => this.addModalChange(e.target.value.trim(), 'userName')} value={addComplaintAccount.userName} disabled={!edit}/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.pw", defaultMessage: "密码", description: "密码" })}>
								<Input type="password" placeholder={intl.formatMessage({ id: "system.please.pw", defaultMessage: "请输入密码", description: "请输入密码" })}
									onChange={(e) => this.addModalChange(e.target.value.trim(), 'password')} value={addComplaintAccount.password} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.cookie", defaultMessage: "Cookie", description: "Cookie" })}>
								<TextArea placeholder={intl.formatMessage({ id: "system.please.cookie", defaultMessage: "请输入Cookie", description: "请输入Cookie" })}
									onChange={(e) => this.addModalChange(e.target.value, 'cookie')} value={addComplaintAccount.cookie} rows={4}/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.complaint.platform", defaultMessage: "投诉平台", description: "投诉平台" })}>
								{/* <Select
									value={addComplaintAccount.platformId}
									disabled={!edit}
									onChange={(value) => this.addModalChange(value, 'platformId')}
									placeholder={intl.formatMessage({ id: "system.choose.complaint.platform", defaultMessage: "请选择投诉平台", description: "请选择投诉平台" })}
								>
								{
									platfromList && platfromList.filter(item => item.isDel === 0)
										.map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
											{
												intl.locale === 'en'
													? opt.dictLabelEn
													: opt.dictLabel
											}
										</Option>)
								}									
								</Select> */}
								<CheckboxGroup
									className="search-check"
									value={addComplaintAccount.platformId}
									onChange={(checkedList) => this.addModalChange(checkedList, 'platformId')}
								>
									{
										platfromList && platfromList.filter(item => item.isDel === 0).map(item => (
											<Checkbox
												value={item.dictVal}
												key={item.dictVal}
												onChange={(e) => this.addModalChange(e, 'platformId')}
											>
												{
													intl.locale === 'en'
														? item.dictLabelEn
														: item.dictLabel
												}
											</Checkbox>
										))
									}
								</CheckboxGroup>
							</Form.Item>
						</Col>
					</Row>
				</div>
			</Modal>
		)
	}
}
export default injectIntl(AddUser)