import React, { Component } from 'react'
import { Row, Col, Form, Input, Alert, Table, Select, Button } from 'antd'
import Content from '../../common/layout/content/index'
import { FormattedMessage } from 'react-intl'
import { getButtonPrem, getName } from '../../../utils/util'
import InputNumber from '../../common/form/numberInput'
import AddLawyer from './children/addUser'
const FormItem = Form.Item
const Option = Select.Option
export default class LawyerUser extends Component {
    constructor(){
        super()
        this.state = {
            pageSize: 10,
            userName: '',
            mobile: '',
            status: undefined,
            searchData: {
                userName: '',
                mobile: '',
                status: '',
            },
            addModalVisible: false,
            addLawyerData: {
                name: '',
                password: '',
                sex: 1,
                mobile: '',
                email: '',
                roleId: undefined
            }
        }
    }
    componentWillMount() {
        this.getLawyerList([], 1)
    }
     // 搜索
     handleSearch() {
        let { userName, mobile, status, searchData } = this.state;
        searchData = {
            userName,
            mobile,
            status: status || '',
        }
        this.setState({
            searchData
        }, () => this.getLawyerList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            userName: '',
            mobile: '',
            status: '',
        }
        this.setState({
            userName: '',
            mobile: '',
            status: undefined,
            searchData
        }, () => this.getLawyerList([], 1))
    }
    //新增用户
    addLawyerModal() {
        let addLawyerData = {
            name: '',
            password: '',
            sex: 1,
            mobile: '',
            email: '',
            roleId: undefined
        }
        this.setState({
            addModalVisible: true,
            addLawyerData
        })
    }

    //modal确定事件
    addLawyerModalOk() {
        let { getLlawyerAdd } = this.props
        let { addLawyerData} = this.state
        getLlawyerAdd(addLawyerData, () => {
            this.setState({
                addModalVisible: false,
            })
            this.getLawyerList([], 1)
        })
    }
    //modal取消事件
    addLawyerModalCancel() {
        this.setState({
            addModalVisible: false,
        })
    }
    //Modal输入选择事件
    addModalChange(value, type) {
        let tempData = this.state.addLawyerData
        tempData[type] = value
        this.setState({
            addLawyerData: tempData
        })
    }
    // 获取数据
    getLawyerList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let { userInfo, getLawyerList } = this.props;
        searchData.userId = userInfo.userId;
        searchData.pageSize = pageSize;
        searchData.pageNo = pageNo;
        getLawyerList(oldList, searchData)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getLawyerList([], 1)
        })
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
            onChange: (page, pageSize) => this.getLawyerList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    //启用
    lawyerOn(id,type) {
        let { getLawyerOn, lawyerList, b2bUserStatus } = this.props
        let data = {
            userId: id
        }
        let statusItem = getName(b2bUserStatus, type);
        data.status = type;
        data.statusName = statusItem.dictLabel;
        data.statusNameEn = statusItem.dictLabelEn;
        getLawyerOn(data, lawyerList)
    }
    //禁用
    lawyerOff(id,type) {
        let { getLawyerOff, lawyerList, b2bUserStatus } = this.props
        let data = {
            userId: id
        }
        let statusItem = getName(b2bUserStatus, type);
        data.status = type;
        data.statusName = statusItem.dictLabel;
        data.statusNameEn = statusItem.dictLabelEn;
        getLawyerOff(data, lawyerList)
    }
    //渲染操作
    renderOperate(record) {
        let { permissionList } = this.props
        return (
            <div>
                {
                    record.status === 2  ? 
                        getButtonPrem(permissionList, '001005002') ? (
                            <a className="opreateStyle" onClick={() => this.lawyerOn(record.userId,1)}>
                                <FormattedMessage id="global.enable" defaultMessage="启用" description="启用" />
                            </a>
                        ):'' 
                    :  getButtonPrem(permissionList, '001005003') ? (
                        <a className="opreateStyle" onClick={() => this.lawyerOff(record.userId,2)}>
                            <FormattedMessage id="global.disable" defaultMessage="禁用" description="禁用" />
                        </a>
                    ) : ''
                }
            </div>
        )
    }
    //创建表格
    createColumns() {
        let intl = this.props.intl;
        const columns = [
            {
                title: <FormattedMessage id="users.userName" defaultMessage="用户名称" description="用户名称" />,
                dataIndex: 'userName',
                key: 'userName'
            },
            {
                title: <FormattedMessage id="users.tel" defaultMessage="手机号码" description="手机号码" />,
                dataIndex: 'mobile',
                key: 'mobile'
            },
            {
                title: <FormattedMessage id="users.registrationTime" defaultMessage="注册时间" description="注册时间" />,
                dataIndex: 'gmtCreate',
                key: 'gmtCreate'
            },
            {
                title: <FormattedMessage id="complaint.account.type" defaultMessage="账号类型" description="账号类型" />,
                dataIndex: 'roleName',
                key: 'roleName'
            },
            {
                title: <FormattedMessage id="users.case.suitNUm" defaultMessage="案件数量" description="案件数量" />,
                dataIndex: 'suitNum',
                key: 'suitNum'
            },
            {
                title: <FormattedMessage id="users.clue.clueNum" defaultMessage="线索数量" description="线索数量" />,
                dataIndex: 'clueNum',
                key: 'clueNum'
            },
            {
                title: <FormattedMessage id="users.userStatus" defaultMessage="用户状态" description="用户状态" />,
                dataIndex: 'statusName',
                key: 'statusName',
                render: (text, item) => (
                    intl.locale === 'en'
                        ? item.statusNameEn
                        : item.statusName
                )
            },
            {
                title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
                dataIndex: 'status',
                key: 'status',
                render: (text, item) => this.renderOperate(item)

            }
        ];
        return columns;
    }
    render() {
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.user.management', title: '用户管理' },
            { link: '', titleId: 'users.lawyer.account', title: '合作律师管理' }
        ]
        let { intl, total, lawyerList, isFetch, b2bUserStatus, permissionList, lawyerRoleType } = this.props
        let { userName, mobile, status, addModalVisible, addLawyerData } = this.state
        return(
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "users.userName", defaultMessage: "用户名称", description: "用户名称" })}>
                                <Input
                                    value={userName}
                                    placeholder={intl.formatMessage({ id: "users.please.enter.userName", defaultMessage: "请输入用户名称", description: "请输入用户名称" })}
                                    onChange={e => this.setState({ userName: e.target.value.trim() })}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "users.tel", defaultMessage: "手机号码", description: "手机号码" })}>
                                <InputNumber
                                    value={mobile}
                                    placeholder={intl.formatMessage({ id: "users.please.enter.tel", defaultMessage: "请输入手机号码", description: "请输入手机号码" })}
                                    onChange={value => this.setState({ mobile: value.trim() })}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "users.userStatus", defaultMessage: "用户状态", description: "用户状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "users.please.select.user.status", defaultMessage: "请选择用户状态", description: "请选择用户状态" })}
                                    value={status}
                                    onChange={val => this.setState({ status: val })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        b2bUserStatus && b2bUserStatus.filter(item => item.isDel === 0)
                                            .map(
                                                opt => <Option value={opt.dictVal} key={opt.dictVal}>
                                                    {intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}
                                                </Option>
                                            )
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
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
                {
                    getButtonPrem(permissionList, '001005004') ? 
                        <Row className="operation-btns">
                            <Col span={24}>
                                <Button type='primary' onClick={() => this.addLawyerModal()}><FormattedMessage id="global.add" defaultMessage="新增" description="新增" /></Button>
                            </Col>
                        </Row> : ''
                }
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table
                    dataSource={lawyerList}
                    columns={this.createColumns()} 
                    pagination={this.createPaginationOption()} 
                    rowKey="userId" 
                    loading={isFetch}
                />
                <AddLawyer
                    visible={addModalVisible}
                    addLawyer={addLawyerData}
                    lawyerRoleType={lawyerRoleType}
                    onOk={() => this.addLawyerModalOk()}
                    onCancel={() => this.addLawyerModalCancel()}
                    addModalChange={(value, type) => this.addModalChange(value, type)}
                />
            </Content>
        )
    }  
}