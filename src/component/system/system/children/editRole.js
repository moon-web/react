import React, { Component } from 'react';
import { Form, Row, Col, Modal, Checkbox } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
const CheckboxGroup = Checkbox.Group
class AddRole extends Component {
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
    //输入框事件
    handleChange(e) {
        let { onChange, systemRoleList } = this.props;
        let result =[];
        if (e.length) {
            for (let i = 0; i < e.length; i++) {
                const element = e[i];
                for (let j = 0; j < systemRoleList.length; j++) {
                    const RoleElement = systemRoleList[j];
                    if (element === RoleElement.roleId) {
                        result.push(RoleElement.roleName)
                    }
                }
            }
        }
        if (onChange) {
            let data = {
                value: e,
                roleStr: result.toString()
            }
            onChange(data)
        }
    }


    render() {
        let { intl, visible, editUser, systemRoleList } = this.props
        return (
            <Modal
                className="root"
                title={intl.formatMessage({ id: 'system.edit.user.role', defaultMessage: '编辑角色', description: '编辑角色' })}
                visible={visible}
                onOk={() => this.props.onOk()}
                onCancel={() => this.props.onCancel()}
            >
                <div className="search-form">
                    <Row>
                        <Col span={20}>
                            <Form.Item label={intl.formatMessage({ id: "system.roles", defaultMessage: "角色选择", description: "角色选择" })}>
                                <CheckboxGroup
                                    className="search-check"
                                    value={editUser.roleIdList}
                                    onChange={(checkedList) => this.handleChange(checkedList, 'roleIds')}
                                >
                                    {
                                        systemRoleList && systemRoleList.map(item => (
                                            <Checkbox
                                                value={item.roleId}
                                                key={item.roleId}
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
                    </Row>
                </div>
            </Modal>
        )
    }
}
export default injectIntl(AddRole)