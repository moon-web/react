import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button, Col, DatePicker, Row, Form, Input, Select, Alert, Table, message } from 'antd'
import Content from '../../common/layout/content'
import InputNumber from '../../common/form/numberInput'
import { formatDateToMs, getButtonPrem, getName } from '../../../utils/util'
const Option = Select.Option;
const FormItem = Form.Item;

export default class InvestigatorManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageSize: 10,
            userName: '',
            mobile: '',
            status: undefined,
            type: undefined,
            startTime: '',
            startTimeMs: 0,
            startDate: null,
            endTime: '',
            endTimeMs: 0,
            endDate: null,
            searchData: {
                userName: '',
                mobile: '',
                status: '',
                type: '',
                startTime: '',
                endTime: ''
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

    // 选择日期
    changeDatePicker(date, dateStr, type) {
        let { startTimeMs, endTimeMs } = this.state;
        if (type === 'startTime') {
            startTimeMs = formatDateToMs(dateStr);
        } else if (type === 'endTime') {
            endTimeMs = formatDateToMs(dateStr)
        }
        if (endTimeMs && (endTimeMs - startTimeMs < 0)) {
            let { intl } = this.props;
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range' }));
            return
        }
        if (type === 'startTime') {
            this.setState({
                startTimeMs,
                startTime: dateStr,
                startDate: date
            })
        } else {
            this.setState({
                endTimeMs,
                endTime: dateStr,
                endDate: date
            })
        }
    }

    // 搜索
    handleSearch() {
        let { userName, mobile, status, type, startTime, endTime, searchData } = this.state;
        searchData = {
            userName,
            mobile,
            type: type || '',
            status: status || '',
            startTime,
            endTime
        }
        this.setState({
            searchData
        }, () => this.getInvestigationList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            userName: '',
            mobile: '',
            type: '',
            status: '',
            startTime: '',
            endTime: ''
        }
        this.setState({
            userName: '',
            mobile: '',
            status: undefined,
            type: undefined,
            startTime: '',
            startTimeMs: 0,
            startDate: null,
            endTime: '',
            endTimeMs: 0,
            endDate: null,
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

    // 更新数据
    updateInvestigationItem(status, item) {
        let { investigationList, updateInvestigationItem, b2bUserStatus } = this.props;
        let data = {
            userId: item.userId,
            status: status,
        }
        let statusItem = getName(b2bUserStatus, data.status);
        data.statusName = statusItem.dictLabel;
        data.statusNameEn = statusItem.dictLabelEn;
        updateInvestigationItem(data, investigationList, () => {
            this.setState({
                selectedRowKeys: [],
                checked: []
            })
            message.info('用户状态更新成功')
        })
    }

    //操作
    renderOperate(record) {
        let { permissionList } = this.props
        return (
            <div>
                {
                    getButtonPrem(permissionList, '001002002') ?
                        <div>
                            {
                                record.status === 2 ? (
                                    <a onClick={() => this.updateInvestigationItem(1, record)}>
                                        <FormattedMessage id="global.enable" defaultMessage="启用" description="启用" />
                                    </a>
                                )
                                    : record.status === 1 ? (
                                        <a onClick={() => this.updateInvestigationItem(2, record)}>
                                            <FormattedMessage id="global.disable" defaultMessage="禁用" description="禁用" />
                                        </a>
                                    )
                                        : ''
                            }
                        </div> : ''
                }
            </div>
        )
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
                        ? <Link to={`/users/investigatorCompany/detail?userId=${item.userId}&type=1`}>{text}</Link>
                        : item.type === 5
                            ? <Link to={`/users/investigator/detail?userId=${item.userId}&type=1`}>{text}</Link>
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
                dataIndex: 'status',
                key: "status",
                render: (text, item) => (
                    intl.locale === 'en'
                        ? item.statusNameEn
                        : item.statusName
                )
            },
            {
                title: <FormattedMessage id="users.tel" defaultMessage="手机号码" description="手机号码" />,
                dataIndex: 'mobile',
                key: "mobile"
            },
            {
                title: <FormattedMessage id="users.registrationTime" defaultMessage="注册时间" description="注册时间" />,
                dataIndex: 'gmtCreate',
                key: "gmtCreate"
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

    render() {
        let { intl, total, investigationList, isFetch, b2bUserStatus, b2bUserType } = this.props;
        let { userName, mobile, status, type, startDate, endDate } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.user.management', title: '用户管理' },
            { link: '', titleId: 'router.investigator.management', title: '调查员管理' }
        ];
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
                            <FormItem label={intl.formatMessage({ id: "users.userTypes", defaultMessage: "用户类型", description: "用户类型" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "users.please.select.user.type", defaultMessage: "请选择用户类型", description: "请选择用户类型" })}
                                    value={type}
                                    onChange={val => this.setState({ type: val })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        b2bUserType && b2bUserType.filter(item => item.isDel === 0 && item.dictVal > 3)
                                            .map(
                                                opt => <Option value={opt.dictVal} key={opt.dictVal}>
                                                    {intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}
                                                </Option>
                                            )
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')} value={startDate} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')} value={endDate} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
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
                    rowKey="userId"
                    loading={isFetch}
                />
            </Content>
        )
    }
}
