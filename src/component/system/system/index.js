import React, { Component } from 'react'
import { Form, Col, Row, Table, Input, Button, Alert, message, Select } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import AddSystem from './children/addUser'
import EditUserRoleModal from './children/editRole'
import { getButtonPrem, getName } from '../../../utils/util'
const Option = Select.Option;

export default class SystemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            id: '',
            edit: true,
            userName: '',
            userAccount: '',
            addModalVisible: false,
            userType: undefined,
            roleId: undefined,
            searchData: {
                userName: '',
                userAccount: '',
                userType: '',
                roleId: ''
            },
            addSystemData: {
                userAccount: '',
                password: '',
                surePassword: '',
                userName: '',
                userType: undefined,
                roleIds: []
            },
            editUserObj: {},
            visibleUserRole: false
        }
    }

    componentWillMount() {
        this.getSystemList([], 1)
        this.props.getSystemRole({ statusFlag: 1 })
    }

    // 获取数据
    getSystemList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData)
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getSystemList(data, oldList)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getSystemList([], 1)
        })
    }

    // 搜索
    handleSearch() {
        let { searchData, userName, userAccount, userType, roleId } = this.state;
        searchData = {
            userName: userName,
            userAccount: userAccount,
            userType: userType === undefined ? '' : userType,
            roleId: roleId === undefined ? '' : roleId
        }
        this.setState({
            searchData
        }, () => this.getSystemList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            userName: '',
            userAccount: '',
            userType: '',
            roleId: ''
        }
        this.setState({
            userName: '',
            userAccount: '',
            userType: undefined,
            roleId: undefined,
            searchData
        }, () => this.getSystemList([], 1))
    }

    // 创建分页器配置项
    createPaginationOption() {
        let { pageNo, total } = this.props;
        let { pageSize } = this.state;
        return {
            current: pageNo,
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            onChange: (page, pageSize) => this.getSystemList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    //渲染操作
    renderOperate(record) {
        let { permissionList } = this.props
        return (
            <div>
                {
                    getButtonPrem(permissionList, '010001003') ? (                        
                        record.userStatus === 0
                            ? (
                                <a onClick={() => this.systemPass(record, 'off')}>
                                    <FormattedMessage id="global.disable" defaultMessage="禁用" description="禁用" />
                                </a>
                            )
                            : record.userStatus === 1
                                ? (
                                    <a onClick={() => this.systemPass(record, 'on')}>
                                        <FormattedMessage id="global.enable" defaultMessage="启用" description="启用" />
                                    </a>
                                )
                            : ''
                        
                    ) : ''
                }                
                <br />
                {
                    getButtonPrem(permissionList, '010001004') ?
                        <a onClick={() => this.editSystemModal(record)}>
                            <FormattedMessage id="system.change.pw" defaultMessage="修改密码" description="修改密码" />
                        </a> : ''
                }                
                <br />
                {
                    getButtonPrem(permissionList, '010001005') ?
                        <a onClick={() => this.showEditUserRoleModal(record)}>
                            <FormattedMessage id="system.edit.user.role" defaultMessage="编辑角色" description="编辑角色" />
                        </a> : ''
                }                
            </div>
        )
    }

    //渲染状态
    renderStatus(record) {
        let { intl } = this.props
        return(
            <span>{intl.locale === 'en' ? record.userStatusNameEn : record.userStatusName}</span>
        )
    }

    // 创建table配置
    createColumns() {
        let { intl } = this.props
        const columns = [{
            title: <FormattedMessage id="system.account" defaultMessage="账号" description="账号" />,
            width: '16%',
            key: 'dataFrom',
            dataIndex: 'userAccount',
        }, {
            title: <FormattedMessage id="system.user.name" defaultMessage="用户名称" description="用户名称" />,
            dataIndex: 'userName',
            width: '16%',
        }, {
            title: <FormattedMessage id="system.user.type" defaultMessage="用户类型" description="用户类型" />,
            dataIndex: 'userType',
            width: '16%',
            render: (text,record) => (
                <span>{intl.locale === 'en' ? record.userTypeNameEn: record.userTypeName}</span>
            )
        }, {
            title: <FormattedMessage id="system.role" defaultMessage="角色" description="角色" />,
            dataIndex: 'roleStr',
            width: '16%',
        }, {
            title: <FormattedMessage id="system.create.tiem" defaultMessage="创建时间" description="创建时间" />,
            dataIndex: 'gmtCreate',
            width: '16%',

        }, {
            title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
            dataIndex: 'userStatus',
            width: '16%',
            render: (text, record) => this.renderStatus(record)
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            width: '20%',
            render: (text, record) => this.renderOperate(record)
        }];
        return columns;
    }

    //新增
    addSystemModal() {
        let addSystemData = {
            userAccount: '',
            password: '',
            surePassword: '',
            userName: '',
            userType: undefined,
            roleIds: []
        }
        this.setState({
            addModalVisible: true,
            edit: true,
            addSystemData
        })
    }

    //修改密码
    editSystemModal(record) {
        let addSystemData = {
            userAccount: '',
            password: '',
            surePassword: '',
            userName: '',
            userType: undefined,
            roleIds: []
        }
        this.setState({
            addModalVisible: true,
            edit: false,
            id: record.userId,
            addSystemData
        })
    }

    //禁用启用
    systemPass(record, type) {
        let { systemList, intl, systemUserStatusType } = this.props
        let typeStatus = 0
        if(type === 'on') {
            typeStatus = 0
        } else if(type === 'off'){
            typeStatus = 1
        }
        let statusData = getName(systemUserStatusType,typeStatus)        
        let data = {
            adminStatus: type,
            adminUserId: record.userId,
            userStatusName: statusData.dictLabel,
            userStatusNameEn: statusData.dictLabelEn
        }
        this.props.systemPass(data, systemList, () => {
            message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
        })
    }

    //modal取消事件
    addSystemModalCancel() {
        this.setState({
            addModalVisible: false,
        })
    }

    //modal确定事件
    addSystemModalOk() {
        let { systemAdd, intl, systemChangePw, isFetchBtag } = this.props
        let { addSystemData, edit, id } = this.state
        let data = {}
        if (edit) {
            if (addSystemData.userAccount === '' || addSystemData.userAccount === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.enter.account', defaultMessage: '请输入账号' }))
                return
            }
            if (addSystemData.userName === '' || addSystemData.userName === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.enter.user.name', defaultMessage: '请输入用户名' }))
                return
            }
            if (addSystemData.password === '' || addSystemData.password === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.pw', defaultMessage: '请输入密码' }))
                return
            }
            if (addSystemData.surePassword === '' || addSystemData.surePassword === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.sure.pw', defaultMessage: '请输入确认密码' }))
                return
            }
            if (addSystemData.password !== addSystemData.surePassword && addSystemData.password !== '') {
                message.info(intl.formatMessage({ id: 'system.two.password', defaultMessage: '两次密码输入不一致' }))
                return
            }
            if (addSystemData.userType === '' || addSystemData.userType === undefined) {
                message.info(intl.formatMessage({ id: 'system.choose.user.type', defaultMessage: '请选择用户类型' }))
                return
            }
            if (addSystemData.roleIds.length <= 0) {
                message.info(intl.formatMessage({ id: 'system.choose.roles', defaultMessage: '请选择角色' }))
                return
            }
            data = {
                userAccount: addSystemData.userAccount,
                userName: addSystemData.userName,
                password: addSystemData.password,
                userType: addSystemData.userType,
                roleIds: addSystemData.roleIds.toString()
            }
            if (isFetchBtag || isFetchBtag === undefined) {
                systemAdd(data, () => {
                    this.setState({
                        addModalVisible: false,
                        edit: true
                    })
                    this.getSystemList([], 1)
                })
            }
        } else {
            if (addSystemData.password === '' || addSystemData.password === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.pw', defaultMessage: '请输入密码' }))
                return
            }
            if (addSystemData.surePassword === '' || addSystemData.surePassword === undefined) {
                message.info(intl.formatMessage({ id: 'system.please.sure.pw', defaultMessage: '请输入确认密码' }))
                return
            }
            if (addSystemData.password !== addSystemData.surePassword && addSystemData.password !== '') {
                message.info(intl.formatMessage({ id: 'system.two.password', defaultMessage: '两次密码输入不一致' }))
                return
            }
            data = {
                id: id,
                password: addSystemData.password,
            }
            systemChangePw(data, () => {
                this.setState({
                    addModalVisible: false,
                    edit: true
                })
            })
        }
    }

    //Modal输入选择事件
    addModalChange(value, type) {
        let tempData = this.state.addSystemData
        tempData[type] = value
        this.setState({
            addSystemData: tempData
        })
    }

    // 显示编辑角色弹窗
    showEditUserRoleModal(item) {
        this.setState({
            editUserObj: Object.assign({}, item),
            visibleUserRole: true
        })
    }

    // 编辑用户角色
    editUserRole(data) {
        let editUserObj = this.state.editUserObj;
        editUserObj.roleIdList = data.value;
        editUserObj.roleStr = data.roleStr
        this.setState({
            editUserObj
        })
    }

    // 提交修改用户角色
    submitEditUserRole() {
        let { editUserObj } = this.state;
        if (!editUserObj.roleIdList.length) {
            message.info('请选择至少一个用户角色');
            return;
        }
        let { updateUserRole, systemList } = this.props;
        let data = {
            id: editUserObj.userId,
            roleIds: editUserObj.roleIdList.toString()
        }
        if (updateUserRole) {
            updateUserRole(data, editUserObj, systemList, () => {
                this.setState({
                    editUserObj: {},
                    visibleUserRole: false
                })
            })
        }
    }

    // 取消修改用户角色
    cancelEditUserRole() {
        this.setState({
            editUserObj: {},
            visibleUserRole: false
        })
    }
    
    render() {
        let { intl, isFetch, systemList, total, systemRoleList, systemUserType, permissionList } = this.props;
        let { userAccount, userName, addModalVisible, addSystemData, edit, userType, roleId, visibleUserRole, editUserObj } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.system.user.management', title: '系统用户管理' }
        ]        
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.account", defaultMessage: "账号", description: "账号" })}>
                                <Input onPressEnter={(e) => this.handleSearch()}  placeholder={intl.formatMessage({ id: "system.please.enter.account", defaultMessage: "请输入账号", description: "请输入账号" })}
                                    onChange={e => this.setState({ userAccount: e.target.value.trim() })} value={userAccount} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.user.name", defaultMessage: "用户名", description: "用户名" })}>
                                <Input onPressEnter={(e) => this.handleSearch()}  placeholder={intl.formatMessage({ id: "system.please.enter.user.name", defaultMessage: "请输入用户名", description: "请输入用户名" })}
                                    onChange={e => this.setState({ userName: e.target.value.trim() })} value={userName} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.user.type", defaultMessage: "用户类型", description: "用户类型" })}>
                                <Select
                                    value={userType}
                                    onChange={val => this.setState({ userType: val })}
                                    placeholder={intl.formatMessage({ id: "system.choose.user.type", defaultMessage: "请选择用户类型", description: "请选择用户类型" })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        systemUserType && systemUserType.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.subordinate.role", defaultMessage: "所属角色", description: "所属角色" })}>
                                <Select
                                    value={roleId}
                                    onChange={val => this.setState({ roleId: val })}
                                    placeholder={intl.formatMessage({ id: "system.choose.user.type", defaultMessage: "请选择用户类型", description: "请选择用户类型" })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        systemRoleList && systemRoleList.map(item => <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} offset={18}>
                            <div className="search-form-btns">
                                <Button type="primary" onClick={() => this.handleSearch()}>
                                    <FormattedMessage id="global.search" defaultMessage="搜索" description="搜索" />
                                </Button>
                                <Button onClick={() => this.handleReset()}>
                                    <FormattedMessage id="global.reset" defaultMessage="重置" description="重置" />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Row className="operation-btns">
                    <Col span={24}>
                        {
                            getButtonPrem(permissionList, '010001002') ?
                                <Button type="primary" onClick={() => this.addSystemModal()}><FormattedMessage id="global.add" defaultMessage="新增" description="新增" /></Button>
                            : ''
                        }
                    </Col>
                </Row>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={systemList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="userId" loading={isFetch} />
                <AddSystem
                    visible={addModalVisible}
                    edit={edit}
                    addSystem={addSystemData}
                    systemRoleList={systemRoleList}
                    systemUserType={systemUserType}
                    onCancel={() => this.addSystemModalCancel()}
                    onOk={() => this.addSystemModalOk()}
                    addModalChange={(value, type) => this.addModalChange(value, type)}
                />
                <EditUserRoleModal
                    visible={visibleUserRole}
                    editUser={editUserObj}
                    systemRoleList={systemRoleList}
                    onCancel={() => this.cancelEditUserRole()}
                    onOk={() => this.submitEditUserRole()}
                    onChange={value => this.editUserRole(value)}
                />
            </Content>
        )
    }
}
