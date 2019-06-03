import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button, Col, Row, Form, Input, Select, Alert, Table, message } from 'antd'
import { getButtonPrem } from '../../../utils/util'
import Content from '../../common/layout/content'
import InputNumber from '../../common/form/numberInput'
const Option = Select.Option;
const FormItem = Form.Item;

export default class InvestigatorManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageSize: 10,
            userName: '',
            nickName: '',
            mobile: '',
            checkStatus: undefined,
            parentName: '',
            parentNick: '',
            parentMobile: '',
            searchData: {
                userName: '',
                nickName: '',
                mobile: '',
                checkStatus: '',
                parentName: '',
                parentNick: '',
                parentMobile: '',
            }
        }
    }

    componentWillMount() {
        let { history, investigationList } = this.props;
        if (!investigationList.length || (investigationList.length && history.action !== 'POP' && !history.location.query)) {
            this.getInvestigationList([], 1)
        }
    }

    // 获取数据
    getInvestigationList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let { userInfo, getInvestigationList } = this.props;
        searchData.userId = userInfo.userId;
        searchData.pageSize = pageSize;
        searchData.pageNo = pageNo;
        getInvestigationList(oldList, searchData)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getInvestigationList([], 1)
        })
    }

    // 搜索
    handleSearch() {
        let { userName, nickName, mobile, checkStatus, parentName, parentNick, parentMobile, searchData } = this.state;
        searchData = {
            userName,
            nickName,
            mobile,
            checkStatus: checkStatus === undefined ? '' : checkStatus ,
            parentName,
            parentNick,
            parentMobile,
        }
        this.setState({
            searchData
        }, () => this.getInvestigationList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            userName: '',
            nickName: '',
            mobile: '',
            checkStatus: '',
            parentName: '',
            parentNick: '',
            parentMobile: '',
        }
        this.setState({
            userName: '',
            nickName: '',
            mobile: '',
            checkStatus: undefined,
            parentName: '',
            parentNick: '',
            parentMobile: '',
            searchData
        }, () => this.getInvestigationList([], 1))
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
            onChange: (page, pageSize) => this.getInvestigationList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 更新审核状态
    updateMonitorItem(item, status) {
        let { userInfo, investigationList, intl } = this.props;
        let data = {
            userId: userInfo.userId,
            monitorId: item.monitorId,
            monitorStatus: status
        }
        this.props.updateMonitorItem(data, investigationList, () => {
            message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
        })
    }

    // 创建行配置
    createColumns() {
        let intl = this.props.intl;
        const columns = [
            {
                title: <FormattedMessage id="users.userName" defaultMessage="用户名称" description="用户名称" />,
                dataIndex: 'userName',
                key: "userName",
                render: (text, item) => (
                    item.type === 4
                        ? <Link to={`/users/investigatorCompany/detail?userId=${item.userId}&type=2`}>{text}</Link>
                        : item.type === 5
                            ? <Link to={`/users/investigator/detail?userId=${item.userId}&type=2`}>{text}</Link>
                            : ''
                )
            },
            {
                title: <FormattedMessage id="users.user.usernick" defaultMessage="用户昵称" description="用户昵称" />,
                dataIndex: 'nickName',
                key: "nickName"
            },
            {
                title: <FormattedMessage id="users.userTypes" defaultMessage="用户类型" description="用户类型" />,
                dataIndex: 'type',
                key: "type",
                render: (text, item) => (
                    intl.locale === 'en'
                    ? item.typeNameEn
                    : item.typeName
                )
            },
            {
                title: <FormattedMessage id="users.userStatus" defaultMessage="用户状态" description="用户状态" />,
                dataIndex: 'checkStatus',
                key: "checkStatus",
                render: (text, item) => (
                    intl.locale === 'en'
                    ? item.checkStatusNameEn
                    : item.checkStatusName
                )
            },
            {
                title: <FormattedMessage id="users.tel" defaultMessage="手机号码" description="手机号码" />,
                dataIndex: 'mobile',
                key: "mobile"
            },
            {
                title: <FormattedMessage id="users.user.investigator.name.of.recommender" defaultMessage="推荐人姓名" description="推荐人姓名" />,
                dataIndex: 'parentName',
                key: "parentName"
            },
            {
                title: <FormattedMessage id="users.user.investigator.recommender.nick" defaultMessage="推荐人昵称" description="推荐人昵称" />,
                dataIndex: 'parentNick',
                key: "parentNick"
            },
            {
                title: <FormattedMessage id="users.user.investigator.recommender.mobile.phone" defaultMessage="推荐人手机" description="推荐人手机" />,
                dataIndex: 'parentMobile',
                key: "parentMobile"
            },
            {
                title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
                render: (text, record) => this.renderOperate(record)
            }
        ];
        return columns;
    }

    renderOperate(record) {
        let { permissionList } = this.props
        return (
            <div>
                {
                    getButtonPrem(permissionList, '001003002') ?
                        <div>
                            {
                                record.checkStatus === 0 ?
                                    record.type === 4 ?
                                        <Link to={`/users/investigatorCompany/detail?userId=${record.userId}&audit=true`}><FormattedMessage id="global.audit" defaultMessage="审核" description="审核" /></Link>
                                        : record.type === 5 ?
                                            <Link to={`/users/investigator/detail?userId=${record.userId}&audit=true`}><FormattedMessage id="global.audit" defaultMessage="审核" description="审核" /></Link>
                                            : ''
                                    : ''
                            }
                        </div> : ''
                }
            </div>
        )
    }

    render() {
        let { intl, total, investigationList, isFetch, b2bUserApplyStatus } = this.props;
        let { userName, nickName, mobile, checkStatus, parentName, parentNick, parentMobile } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.user.management', title: '用户管理' },
            { link: '', titleId: 'router.investigator.application.management', title: '调查员申请管理' }
        ]
        return (
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
                            <FormItem label={intl.formatMessage({ id: "users.user.usernick", defaultMessage: "用户昵称", description: "用户昵称" })}>
                                <Input
                                    value={nickName}
                                    placeholder={intl.formatMessage({ id: "users.please.enter.nickname", defaultMessage: "请输入用户昵称", description: "请输入用户昵称" })}
                                    onChange={e => this.setState({ nickName: e.target.value.trim() })}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "users.userStatus", defaultMessage: "用户状态", description: "用户状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "users.please.select.user.status", defaultMessage: "请选择用户状态", description: "请选择用户状态" })}
                                    value={checkStatus}
                                    onChange={val => this.setState({ checkStatus: val })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        b2bUserApplyStatus && b2bUserApplyStatus.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.dictVal}>{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
                                    }
                                </Select>
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
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "users.user.investigator.name.of.recommender", defaultMessage: "推荐人姓名", description: "推荐人姓名" })}>
                                <Input
                                    value={parentName}
                                    onChange={e => this.setState({ parentName: e.target.value.trim() })}
                                    placeholder={intl.formatMessage({ id: "users.please.enter.referrer.name", defaultMessage: "请输入推荐人姓名", description: "请输入推荐人姓名" })}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "users.user.investigator.recommender.nick", defaultMessage: "推荐人昵称", description: "推荐人昵称" })}>
                                <Input
                                    value={parentNick}
                                    placeholder={intl.formatMessage({ id: "users.please.enter.referrer.nickname", defaultMessage: "请输入推荐人昵称", description: "请输入推荐人昵称" })}
                                    onChange={e => this.setState({ parentNick: e.target.value.trim() })}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "users.user.investigator.recommender.mobile.phone", defaultMessage: "推荐人手机", description: "推荐人手机" })}>
                                <InputNumber
                                    value={parentMobile}
                                    placeholder={intl.formatMessage({ id: "users.please.enter.referrer.mobile", defaultMessage: "请输入推荐人手机", description: "请输入推荐人手机" })}
                                    onChange={value => this.setState({ parentMobile: value.trim() })}
                                />
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
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table
                    dataSource={investigationList}
                    columns={this.createColumns()}
                    pagination={this.createPaginationOption()}
                    rowKey="userId" loading={isFetch}
                />
            </Content>
        )
    }
}
