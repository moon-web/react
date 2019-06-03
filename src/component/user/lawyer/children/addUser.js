import React, { Component } from 'react';
import { Form, Input, Row, Col, Modal, message, Radio, Select } from 'antd';
import { injectIntl } from 'react-intl';
const RadioGroup = Radio.Group
const Option = Select.Option
class AddUser extends Component {
	constructor() {
		super()
		this.state = {
		}
	}
	//确定
	onOk() {
        let { addLawyer, intl } = this.props
        let myreg =/^(0|86|17951)?(13[0-9]|14[5-9]|15[012356789]|16[56]|17[0-8]|18[0-9]|19[189])[0-9]{8}$/
        if(!addLawyer.name) {
            message.info(intl.formatMessage({id: 'users.lawyer.please.name',defaultMessage: '请输入姓名'}))
            return 
        }
        if(!addLawyer.mobile) {
            message.info(intl.formatMessage({id: 'users.lawyer.please.mobile',defaultMessage: '请输入手机'}))
            return
        }
        if(!myreg.test(addLawyer.mobile)) {
            message.info(intl.formatMessage({id: 'users.lawyer.please.mobile.sure',defaultMessage: '请输入正确的手机'}))
            return
        }
        if(!addLawyer.password){
            message.info(intl.formatMessage({id: 'system.please.pw',defaultMessage: '请输入密码'}))
            return
        }
        if(!addLawyer.email) {
            message.info(intl.formatMessage({id: 'users.lawyer.please.email',defaultMessage: '请输入邮箱'}))
            return
        }
        if(!addLawyer.roleId) {
            message.info(intl.formatMessage({id: 'lawyer.please.select.account.type',defaultMessage: '请选择账号类型'}))
            return
        }
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
		let { intl, visible, addLawyer, lawyerRoleType } = this.props
		return (
			<Modal
				className="root"
				title={intl.formatMessage({ id: "global.add", defaultMessage: "新增" })}
				visible={visible}
				onOk={() => this.onOk()}
				onCancel={() => this.onCancel()}
			>
				<div className="search-form">
                    <Row>
                        <Col span={20}>
                            <Form.Item label={intl.formatMessage({ id: 'users.lawyer.name', defaultMessage: "姓名" })}>
                                <Input placeholder={intl.formatMessage({id: 'users.lawyer.please.name',defaultMessage: '请输入姓名'})}
                                    onChange={(e) => this.addModalChange(e.target.value.trim(), 'name')}
                                    value={addLawyer.name}
                                />
                            </Form.Item>
                        </Col>
                    </Row> 
                    <Row>
                        <Col span={20}>
                            <Form.Item label="性别">
                                <RadioGroup onChange={(e) => this.addModalChange(e.target.value,'sex')} value={addLawyer.sex}>
                                    <Radio value={1}>男</Radio>
                                    <Radio value={2}>女</Radio>
                                </RadioGroup>
                            </Form.Item>
                        </Col>
                    </Row>                    
                    <Row>
                        <Col span={20}>
                            <Form.Item label={intl.formatMessage({ id: 'users.lawyer.mobile', defaultMessage: "手机" })}>
                                <Input placeholder={intl.formatMessage({id: 'users.lawyer.please.mobile',defaultMessage: '请输入手机'})}
                                    onChange={(e) => this.addModalChange(e.target.value.trim(), 'mobile')}
                                    value={addLawyer.mobile}    
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <Form.Item label={intl.formatMessage({ id: 'system.pw', defaultMessage: "密码" })}>
                                <Input type="password" placeholder={intl.formatMessage({id: 'system.please.pw',defaultMessage: '请输入密码'})}
                                    onChange={(e) => this.addModalChange(e.target.value.trim(), 'password')}
                                    value={addLawyer.password}    
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <Form.Item label={intl.formatMessage({ id: 'users.lawyer.email', defaultMessage: "邮箱" })}>
                                <Input placeholder={intl.formatMessage({id: 'users.lawyer.please.email',defaultMessage: '请输入邮箱'})}
                                    onChange={(e) => this.addModalChange(e.target.value.trim(), 'email')}
                                    value={addLawyer.email}   
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <Form.Item label={intl.formatMessage({ id: 'complaint.account.type', defaultMessage: "账号类型" })}>
                                <Select
                                        placeholder={intl.formatMessage({ id: "lawyer.please.select.account.type", defaultMessage: "请选择账号类型", description: "请选择账号类型" })}
                                        value={addLawyer.roleId}
                                        onChange={val => this.addModalChange(val, 'roleId')}
                                    >
                                       {
                                            lawyerRoleType && lawyerRoleType.filter(item => item.isDel === 0)
                                                .map(
                                                    opt => <Option value={opt.roleId} key={opt.roleId}>
                                                        { opt.roleName }
                                                    </Option>
                                                )
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
export default injectIntl(AddUser)