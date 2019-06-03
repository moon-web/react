import React, { Component } from 'react';
import { Form, Input, Row, Col, Select, Modal, Checkbox } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group
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
		let { intl, visible, systemRoleList, addSystem, edit, systemUserType } = this.props
		let title = ''
		if (edit) {
			title = intl.formatMessage({ id: 'global.add', defaultMessage: '新增', description: '新增' })
		} else {
			title = intl.formatMessage({ id: 'system.change.pw', defaultMessage: '修改密码', description: '修改密码' })
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
					{
						edit ?
							<Row>
								<Col span={20}>
									<Form.Item label={intl.formatMessage({ id: "system.account", defaultMessage: "账号", description: "账号" })}>
										<Input placeholder={intl.formatMessage({ id: "system.please.enter.account", defaultMessage: "请输入账号", description: "请输入账号" })}
											onChange={(e) => this.addModalChange(e.target.value.trim(), 'userAccount')} value={addSystem.userAccount} />
									</Form.Item>
								</Col>
							</Row> : ''
					}
					{
						edit ?
							<Row>
								<Col span={20}>
									<Form.Item label={intl.formatMessage({ id: "system.user.name", defaultMessage: "用户名", description: "用户名" })}>
										<Input placeholder={intl.formatMessage({ id: "system.please.enter.user.name", defaultMessage: "请输入用户名", description: "请输入用户名" })}
											onChange={(e) => this.addModalChange(e.target.value.trim(), 'userName')} value={addSystem.userName} />
									</Form.Item>
								</Col>
							</Row> : ''
					}
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.pw", defaultMessage: "密码", description: "密码" })}>
								<Input type="password" placeholder={intl.formatMessage({ id: "system.please.pw", defaultMessage: "请输入密码", description: "请输入密码" })}
									onChange={(e) => this.addModalChange(e.target.value.trim(), 'password')} value={addSystem.password} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={20}>
							<Form.Item label={intl.formatMessage({ id: "system.sure.pw", defaultMessage: "确认密码", description: "确认密码" })}>
								<Input type="password" placeholder={intl.formatMessage({ id: "system.please.sure.pw", defaultMessage: "请输入确认密码", description: "请输入确认密码" })}
									onChange={(e) => this.addModalChange(e.target.value.trim(), 'surePassword')} value={addSystem.surePassword} />
							</Form.Item>
						</Col>
					</Row>
					{
						edit ?
							<Row>
								<Col span={20}>
									<Form.Item label={intl.formatMessage({ id: "system.user.type", defaultMessage: "用户类型", description: "用户类型" })}>
										<Select
											value={addSystem.userType}
											onChange={(value) => this.addModalChange(value, 'userType')}
											placeholder={intl.formatMessage({ id: "system.choose.user.type", defaultMessage: "请选择用户类型", description: "请选择用户类型" })}
										>
											{
												systemUserType && systemUserType.filter(item => item.dictVal !== 1)
													.map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
											}
										</Select>
									</Form.Item>
								</Col>
							</Row> : ''
					}
					{
						edit ?
							<Row>
								<Col span={20}>
									<Form.Item label={intl.formatMessage({ id: "system.roles", defaultMessage: "角色选择", description: "角色选择" })}>
										<CheckboxGroup
											className="search-check"
											value={addSystem.roleIds}
											onChange={(checkedList) => this.addModalChange(checkedList, 'roleIds')}
										>
											{
												systemRoleList && systemRoleList.map(item => (
													<Checkbox
														value={item.roleId}
														key={item.roleId}
														onChange={(e) => this.addModalChange(e.target.value, 'roleIds')}
													>
														{
															item.roleNameEng
																? <FormattedMessage id={item.roleNameEng} defaultMessage={item.roleName} description={item.roleName} />
																: item.roleName
														}
													</Checkbox>
												))
											}
										</CheckboxGroup>
									</Form.Item>
								</Col>
							</Row> : ''
					}
				</div>
			</Modal>
		)
	}
}
export default injectIntl(AddUser)