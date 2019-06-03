import React, { Component } from 'react'
import { Form, Col, Row, Table, Input, Select, DatePicker, Button, Alert, message } from 'antd'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Content from '../../common/layout/content/index'
import InputNumber from '../../common/form/numberInput'
import { formatDateToMs, getButtonPrem, getName } from '../../../utils/util'
const Option = Select.Option;

export default class MonitorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            ownedBrand: undefined,
            monitorStatus: undefined,
            pageSize: 10,
            monitorNameLike: '',
            monitorId: '',
            searchData: {
                monitorNameLike: '',
                ownedBrand: '',
                monitorStatus: '',
                monitorId: '',
                startTime: '',
                endTime: ''
            }

        }
    }

    componentWillMount() {
        let { searchData, monitorList, pageSize, history } = this.props;
        if (!monitorList.length || (monitorList.length && history.action !== 'POP' && !history.location.query)) {
            this.getMonitorList([], 1)
        } else {
            this.setState({
                searchData,
                monitorNameLike: searchData.monitorNameLike,
                ownedBrand: searchData.ownedBrand || undefined,
                monitorStatus: searchData.monitorStatus || undefined,
                monitorId: searchData.monitorId,
                startTime: searchData.startTime,
                endTime: searchData.endTime,
                startDate: searchData.startTime ? moment(searchData.startTime, "YYYY-MM-DD") : null,
                endDate: searchData.endTime ? moment(searchData.endTime, "YYYY-MM-DD") : null,
                pageSize,
            })
        }
    }

    // 获取数据
    getMonitorList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        searchData.userId = this.props.userInfo.userId;
        searchData.pageSize = pageSize;
        searchData.pageNo = pageNo;
        this.props.getMonitorList(oldList, searchData)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getMonitorList([], 1)
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
        let { monitorNameLike, ownedBrand, monitorStatus, monitorId, startTime, endTime, searchData } = this.state;
        searchData = {
            monitorNameLike: monitorNameLike || '',
            ownedBrand: ownedBrand || '',
            monitorStatus: monitorStatus || '',
            monitorId: monitorId || '',
            startTime: startTime || '',
            endTime: endTime || ''
        }
        this.setState({
            searchData
        }, () => this.getMonitorList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            monitorNameLike: '',
            ownedBrand: '',
            monitorStatus: '',
            monitorId: '',
            startTime: '',
            endTime: ''
        }
        this.setState({
            monitorNameLike: '',
            ownedBrand: undefined,
            monitorStatus: undefined,
            monitorId: '',
            startTime: '',
            startDate: null,
            endTime: '',
            endDate: null,
            searchData
        }, () => this.getMonitorList([], 1))
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
            onChange: (page, pageSize) => this.getMonitorList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 更新审核状态
    updateMonitorItem(item, status) {
        let { userInfo, monitorList, intl, changeMonitorToAgain, changeMonitorToEnd, monitorRulesTaskStatus } = this.props;
        let data = {
            userId: userInfo.userId,
            monitorId: item.monitorId,
            monitorStatus: status
        }
        if (changeMonitorToAgain && status === 1) {
            let auditStatus = getName(monitorRulesTaskStatus, 2);
            data.monitorStatusName = auditStatus.dictLabel;
            data.monitorStatusNameEn = auditStatus.dictLabelEn;
            changeMonitorToAgain(data, monitorList, () => {
                message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
            })
        } else if (changeMonitorToEnd && status === 2) {
            let auditStatus = getName(monitorRulesTaskStatus, 1);
            data.monitorStatusName = auditStatus.dictLabel;
            data.monitorStatusNameEn = auditStatus.dictLabelEn;
            changeMonitorToEnd(data, monitorList, () => {
                message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
            })
        }
    }


    // 创建table配置
    createColumns() {
        let { permissionList, intl } = this.props
        const columns = [{
            title: <FormattedMessage id="monitor.rule.id" defaultMessage="规则ID" description="规则ID" />,
            dataIndex: 'monitorId',
            key: 'monitorId',
            width: '15%',
            render: (text, item) => (
                <div>
                    <div>
                        <FormattedMessage id="monitor.rule.id" defaultMessage="规则ID" description="规则ID" />:
                        <Link to={`/monitor/detail?id=${text}`} >{getButtonPrem(permissionList, '005001007') ? text : ''}</Link>
                    </div>
                    <div>
                        <FormattedMessage id="monitor.picture.rule.name" defaultMessage="规则名称" description="规则名称" />:
                    {item.monitorName}
                    </div>
                </div>
            )
        }, {
            title: <FormattedMessage id="monitor.picture.rule.brand" defaultMessage="所属品牌" description="所属品牌" />,
            dataIndex: 'brandName',
            key: 'brandName',
            width: '15%'
        }, {
            title: <FormattedMessage id="global.start.time" defaultMessage="开始时间" description="开始时间" />,
            dataIndex: 'monitorStartTimeStr',
            key: 'monitorStartTimeStr',
            width: '15%'
        }, {
            title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
            dataIndex: 'monitorStatus',
            key: 'monitorStatus',
            width: '8%',
            render: (text, item) => (
                intl.locale === 'en'
                    ? item.monitorStatusNameEn
                    : item.monitorStatusName
            )
        }, {
            title: <FormattedMessage id="global.pass" defaultMessage="通过" description="通过" />,
            dataIndex: 'pass',
            key: 'pass',
            width: '8%',
            render: (text, item) => {
                return (
                    getButtonPrem(permissionList, '005002001') ?
                        <Link to={{
                            pathname: "/monitor/result",
                            query: { monitorId: item.monitorId, startTime: item.monitorStartTimeStr, auditStatus: 1, ownedBrand: item.ownedBrand }
                        }}>
                            {text}
                        </Link> : <span style={{ color: '#668fff' }}>{text}</span>
                )
            }
        }, {
            title: <FormattedMessage id="global.fail" defaultMessage="不通过" description="不通过" />,
            dataIndex: 'notPass',
            key: 'notPass',
            width: '8%',
            render: (text, item) => {
                return (
                    getButtonPrem(permissionList, '005002001') ?
                        <Link to={{
                            pathname: "/monitor/result",
                            query: { monitorId: item.monitorId, startTime: item.monitorStartTimeStr, auditStatus: 2, ownedBrand: item.ownedBrand }
                        }}>
                            {text}
                        </Link> : <span style={{ color: '#668fff' }}>{text}</span>
                )
            }
        }, {
            title: <FormattedMessage id="global.pending" defaultMessage="待审核" description="待审核" />,
            dataIndex: 'toAudited',
            key: 'toAudited',
            width: '8%',
            render: (text, item) => {
                return (
                    getButtonPrem(permissionList, '005002001') ?
                        <Link to={{
                            pathname: "/monitor/result",
                            query: { monitorId: item.monitorId, startTime: item.monitorStartTimeStr, auditStatus: 0, ownedBrand: item.ownedBrand }
                        }}>
                            {text}
                        </Link> : <span style={{ color: '#668fff' }}>{text}</span>
                )
            }
        }, {
            title: <FormattedMessage id="global.case.status.allocated" defaultMessage="已分配" description="已分配" />,
            dataIndex: 'distributedNum',
            key: 'distributedNum',
            width: '8%',
            render: (text, item) => {
                return (
                    getButtonPrem(permissionList, '005002001') ?
                        <Link to={{
                            pathname: "/monitor/result",
                            query: { monitorId: item.monitorId, startTime: item.monitorStartTimeStr, auditStatus: 3, ownedBrand: item.ownedBrand }
                        }}>
                            {text}
                        </Link> : <span style={{ color: '#668fff' }}>{text}</span>
                )
            }
        }, {
            title: <FormattedMessage id="report.waiting.trial" defaultMessage="待客审" description="待客审" />,
            dataIndex: 'toGuestNum',
            key: 'toGuestNum',
            width: '8%',
            render: (text, item) => {
                return (
                    getButtonPrem(permissionList, '005002001') ?
                        <Link to={{
                            pathname: "/monitor/result",
                            query: { monitorId: item.monitorId, startTime: item.monitorStartTimeStr, auditStatus: 4, ownedBrand: item.ownedBrand }
                        }}>
                            {text}
                        </Link> : <span style={{ color: '#668fff' }}>{text}</span>
                )
            }
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            dataIndex: 'monitorStatus',
            key: 'monitorMode',
            width: '8%',
            render: (text, item) => (
                text === 1
                    ? getButtonPrem(permissionList, '005001006') ? <a onClick={() => this.updateMonitorItem(item, 1)}><FormattedMessage id="monitor.run.again" defaultMessage="再跑一次" description="再跑一次" /></a> : ''
                    : text === 2
                        ? getButtonPrem(permissionList, '005001005') ? <a onClick={() => this.updateMonitorItem(item, 2)}><FormattedMessage id="global.over" defaultMessage="结束" description="结束" /></a> : ''
                        : ''
            )
        }];
        return columns;
    }

    render() {
        let { intl, total, monitorList, brandList, history, isFetch, permissionList, monitorRulesTaskStatus } = this.props;
        let { monitorNameLike, ownedBrand, monitorId, monitorStatus, startDate, endDate } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.data.monitoring', title: '数据监测管理' },
            { link: '', titleId: 'router.monitoring.rlue.management', title: '监控规则管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "monitor.picture.rule.name", defaultMessage: "规则名称", description: "规则名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "monitor.please.input.the.rule.name", defaultMessage: "请输入规则名称", description: "请输入规则名称" })} value={monitorNameLike} onChange={e => this.setState({ monitorNameLike: e.target.value.trim() })} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "monitor.picture.rule.brand", defaultMessage: "所属品牌", description: "所属品牌" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "monitor.picture.rule.choose.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    value={ownedBrand}
                                    onChange={value => this.setState({ ownedBrand: value })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        brandList && brandList.filter(item => item.isDelete === 0)
                                            .map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.status", defaultMessage: "状态", description: "状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                    value={monitorStatus}
                                    onChange={val => this.setState({ monitorStatus: val })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        monitorRulesTaskStatus && monitorRulesTaskStatus.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.dictVal}>{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "monitor.rule.id", defaultMessage: "规则ID", description: "规则ID" })}>
                                <InputNumber
                                    placeholder={intl.formatMessage({ id: "monitor.please.enter.the.monitoring.rule.ID", defaultMessage: "请输入监控规则ID", description: "请输入监控规则ID" })}
                                    value={monitorId}
                                    onChange={value => this.setState({ monitorId: value })}
                                    onPressEnter={(e) => this.handleSearch()}
                                />
                            </Form.Item>
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
                <Row className="operation-btns">
                    <Col span={24}>
                        {
                            getButtonPrem(permissionList, '005001002') ?
                                <Button type='primary' onClick={() => history.push('/monitor/new/rule')}><FormattedMessage id="router.new.monitoring.rlue" defaultMessage="新增监控规则" description="新增监控规则" /></Button>
                                : ""
                        }
                        {
                            getButtonPrem(permissionList, '005001001') ?
                                <Button type='primary' onClick={() => history.push("/monitor/new/manual")}><FormattedMessage id="router.new.manual.rlue" defaultMessage="新增手动规则" description="新增手动规则" /></Button>
                                : ""
                        }
                        {
                            getButtonPrem(permissionList, '005001003') ?
                                <Button type='primary' onClick={() => history.push('/monitor/new/picture')}><FormattedMessage id="router.new.picture.rlue" defaultMessage="新增图片规则" description="新增图片规则" /></Button>
                                : ""
                        }
                    </Col>
                </Row>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={monitorList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="monitorId" loading={isFetch} />
            </Content>
        )
    }
}
