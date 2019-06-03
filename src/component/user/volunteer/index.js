import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Col, Row, Form, Input, Select, Alert, Table, message } from 'antd'
import Content from '../../common/layout/content'
import InputNumber from '../../common/form/numberInput'
import { formatDateToMs, getButtonPrem, getName } from '../../../utils/util'
const Option = Select.Option;
const FormItem = Form.Item;

export default class VolunteerManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pageSize: 10,
            userName: '',
            mobile: '',
            status: undefined,
            type: undefined,
            searchData: {
                userName: '',
                mobile: '',
                status: '',
                type: ''
            }
        }
    }

    componentWillMount() {
        this.getVolunteerList([], 1)
    }

    // 获取数据
    getVolunteerList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let { userInfo, getVolunteerList } = this.props;
        searchData.userId = userInfo.userId;
        searchData.pageSize = pageSize;
        searchData.pageNo = pageNo;
        getVolunteerList(oldList, searchData)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getVolunteerList([], 1)
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
        let { userName, mobile, status, type, searchData } = this.state;
        searchData = {
            userName,
            mobile,
            status: status || '',
            type: type || ''
        }
        this.setState({
            searchData
        }, () => this.getVolunteerList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            userName: '',
            mobile: '',
            status: '',
            type: ''
        }
        this.setState({
            userName: '',
            mobile: '',
            status: undefined,
            type: undefined,
            searchData
        }, () => this.getVolunteerList([], 1))
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
            onChange: (page, pageSize) => this.getVolunteerList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 更新审核状态
    updateVolunteerItem(item, status) {
        let { userInfo, volunteerList, updateVolunteerItem, b2bUserStatus } = this.props;
        let data = {
            userId: userInfo.userId,
            makeUserId: item.userId,
            status
        }
        let statusItem = getName(b2bUserStatus, data.status);
        data.statusName = statusItem.dictLabel;
        data.statusNameEn = statusItem.dictLabelEn;
        updateVolunteerItem(data, volunteerList)
    }

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
                title: <FormattedMessage id="users.userTypes" defaultMessage="用户类型" description="用户类型" />,
                dataIndex: 'typeName',
                key: 'typeName',
                render: (text, item) => (
                    intl.locale === 'en'
                        ? item.typeNameEn
                        : item.typeName
                )
            },
            {
                title: <FormattedMessage id="users.registrationTime" defaultMessage="注册时间" description="注册时间" />,
                dataIndex: 'gmtCreate',
                key: 'gmtCreate'
            },
            {
                title: <FormattedMessage id="users.totalSubmissions" defaultMessage="总提交量" description="总提交量" />,
                dataIndex: 'vTotalNum',
                key: 'vTotalNum'
            },
            {
                title: <FormattedMessage id="users.accurateQuantity" defaultMessage="成立量" description="成立量" />,
                dataIndex: 'vSuccNum',
                key: 'vSuccNum'
            },
            {
                title: <FormattedMessage id="users.accuracy" defaultMessage="准确率" description="准确率" />,
                dataIndex: 'correctRate',
                key: 'correctRate',
                render: text => text + '%'
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
    
    renderOperate(item) {
        let { permissionList } = this.props
        return (
            <div>
                {
                    getButtonPrem(permissionList, '001001002') ?
                        <div>
                            {
                                item.status === 1 ?
                                    <a onClick={() => this.updateVolunteerItem(item, 2)}><FormattedMessage id="global.disable" defaultMessage="禁用" description="禁用" /></a>
                                    : item.status === 2 ?
                                        <a onClick={() => this.updateVolunteerItem(item, 1)}><FormattedMessage id="global.enable" defaultMessage="启用" description="启用" /></a>
                                        : ''
                            }
                        </div> : ''
                }
            </div>

        )
    }
    render() {
        let { intl, total, volunteerList, isFetch, b2bUserStatus, b2bUserType } = this.props;
        let { userName, mobile, status, type } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.user.management', title: '用户管理' },
            { link: '', titleId: 'router.volunteer.management', title: '志愿者管理' }
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
                            <FormItem label={intl.formatMessage({ id: "users.tel", defaultMessage: "手机号码", description: "手机号码" })}>
                                <InputNumber
                                    value={mobile}
                                    onPressEnter={(e) => this.handleSearch()}
                                    placeholder={intl.formatMessage({ id: "users.please.enter.tel", defaultMessage: "请输入手机号码", description: "请输入手机号码" })}
                                    onChange={value => this.setState({ mobile: value.trim() })}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "users.userStatus", defaultMessage: "用户状态", description: "用户状态" })}>
                                <Select
                                    value={status}
                                    onChange={val => this.setState({ status: val })}
                                    placeholder={intl.formatMessage({ id: "users.please.select.user.status", defaultMessage: "请选择用户状态", description: "请选择用户状态" })}
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
                                    value={type}
                                    onChange={val => this.setState({ type: val })}
                                    placeholder={intl.formatMessage({ id: "users.please.select.user.type", defaultMessage: "请选择用户类型", description: "请选择用户类型" })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        b2bUserType && b2bUserType.filter(item => item.isDel === 0 && item.dictVal < 4 && item.dictVal !== 2)
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

                        </Col>
                        <Col span={6}>

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
                <Table dataSource={volunteerList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="userId" loading={isFetch} />
            </Content>
        )
    }
}
