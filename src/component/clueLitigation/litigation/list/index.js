import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Col, Row, Table, Input, Button, Alert, message, Select, DatePicker, Badge } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import Content from '../../../common/layout/content/index'
import { getButtonPrem, formatDateToMs } from '../../../../utils/util'
import moment from 'moment'
import '../index.css'
const Option = Select.Option
class Litigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            brandId: undefined,
            status: undefined,
            suitNo: '',
            clueName: '',
            startTimeMs: '',
            startTime: '',
            startDate: null,
            endTimeMs: '',
            endTime: '',
            endDate: null,
            searchData: {
                brandId: '',
                status: '',
                suitNo: '',
                clueName: '',
                gmtStart: '',
                gmtEnd: '',
            }
        }
    }

    componentWillMount() {
        let { ligitaionList, history } = this.props;
        if (history.action !== 'POP') {
            if (history.location.query && history.location.query.goBack && ligitaionList.length) {
                let { searchData } = this.props
                let { brandId, status, suitNo, clueName, gmtStart, gmtEnd } = this.props.searchData
                let data = Object.assign({}, searchData)
                this.setState({
                    searchData: data,
                    brandId: brandId ? brandId : undefined,
                    status: status !== '' ? status : undefined,
                    suitNo,
                    clueName,
                    startTime: gmtStart,
                    endTime: gmtEnd,
                    startDate: gmtStart ? moment(gmtStart, "YYYY-MM-DD") : null,
                    endDate: gmtEnd ? moment(gmtEnd, "YYYY-MM-DD") : null,
                })
            } else {
                if (history.location.query) {
                    let status = history.location.query.status;
                    if (status !== undefined) {
                        let { searchData } = this.state;
                        searchData.status = status;
                        this.setState({
                            status: status,
                            searchData
                        }, () => this.getLitigationList([], 1))
                    }
                } else {
                    this.getLitigationList([], 1)
                }
            }
        } else {
            this.getLitigationList([], 1)
        }
    }

    // //获取数据
    getLitigationList(oldThreadListData, pageNo) {
        let { searchData, pageSize } = this.state
        let { getLitigationListData } = this.props
        let data = Object.assign({}, searchData);
        data.pageNo = pageNo
        data.pageSize = pageSize
        getLitigationListData(data, oldThreadListData)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getLitigationList([], 1)
        })
    }

    // 搜索
    handleSearch() {
        let { brandId, status, suitNo, clueName, startTime, endTime } = this.state;
        let searchData = {
            brandId: brandId ? brandId : '',
            status: status === undefined ? '' : status,
            suitNo,
            clueName,
            gmtStart: startTime ? startTime : '',
            gmtEnd: endTime ? endTime : ''
        }
        this.setState({
            searchData
        }, () => this.getLitigationList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            brandId: '',
            status: '',
            suitNo: '',
            clueName: '',
            gmtStart: '',
            gmtEnd: '',
        }
        this.setState({
            brandId: undefined,
            status: undefined,
            suitNo: '',
            clueName: '',
            startTime: '',
            endTime: '',
            searchData,
            startTimeMs: '',
            startDate: null,
            endTimeMs: '',
            endDate: null,
            pageSize: 10,
            pageNo: 1,
        }, () => this.getLitigationList([], 1))
    }

    // 创建分页器配置项
    createPaginationOption() {
        let { pageNo, total } = this.props
        let { pageSize } = this.state
        return {
            current: pageNo,
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            onChange: (page, pageSize) => this.getLitigationList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
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
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range', defaultMessage: "请选择有效的时间范围", description: "请选择有效的时间范围" }));
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

    //赋值
    handleChange(value, key) {
        this.setState({
            [key]: value
        })
    }

    //操作
    renderOperate(record) {
        let { permissionList } = this.props;
        if ((record.status === 2 || record.status === 3 || record.status === 4 || record.status === 5 || record.status === 6 || record.status === 7 || record.status === 8) && getButtonPrem(permissionList, '019001001')) {
            return (
                <Link to={`/thread/litigation/detail?suitNo=${record.suitNo}`}>
                    <FormattedMessage id="global.audit" defaultMessage="审核" description="审核" />
                </Link>
            )
        } else if (record.status === 12 && getButtonPrem(permissionList, '019001003')) {
            return (
                <Link to={`/thread/litigation/detail?suitNo=${record.suitNo}`}>
                    <FormattedMessage id="global.distribution" defaultMessage="分配" description="分配" />
                </Link>
            )
        } else if (record.status === 1 && getButtonPrem(permissionList, '019001003') && record.isDel === 0) {
            return (
                <Link to={`/thread/litigation/detail?suitNo=${record.suitNo}`}>
                    <FormattedMessage id="ligiation.redistribution" defaultMessage="重新分配" description="重新分配" />
                </Link>
            )
        } else {
            return (
                <Link to={`/thread/litigation/detail?suitNo=${record.suitNo}`}>
                    <FormattedMessage id="ligiation.look" defaultMessage="查看" description="查看" />
                </Link>
            )
        }
    }

    renderStateName(record) {
        let { intl } = this.props;
        return (
            <div className="status-badge">
                {
                    intl.locale === 'zh' ? 
                    <div>
                        {
                            record.optFlag === 1 ?
                                <Badge status="warning" /> 
                            : ''
                        }
                        {record.statusName}
                    </div>  : 
                    <div>
                        {
                            record.optFlag === 1 ?
                                <Badge status="warning" /> 
                            : ''
                        }
                        {record.statusNameEn}
                    </div>
                //  : 
                }
                {
                    record.status === 14 ? record.auditReason ?
                        <p>
                            ({record.auditReason})
                        </p> : '' : ''
                }
            </div>
        )
    }

    // 创建table配置
    createColumns() {
        const columns = [
            {
                title: <FormattedMessage id="ligiation.proceedings.number" defaultMessage="诉讼案件编号" />,
                key: 'suitNo',
                dataIndex: 'suitNo'
            },
            {
                title: <FormattedMessage id="thread.clue.name" defaultMessage="线索名称" />,
                dataIndex: 'clueName',
                key: 'clueName',
            },
            {
                title: <FormattedMessage id="monitor.picture.rule.brand" defaultMessage="所属品牌" />,
                dataIndex: 'brandName',
                key: 'brandName',
            },
            {
                title: <FormattedMessage id="ligiation.cooperative.lawyer" defaultMessage="合作律师" />,
                dataIndex: 'allotedName',
                key: 'allotedName',
            },
            {
                title: <FormattedMessage id="global.start.time" defaultMessage="开始时间" />,
                dataIndex: 'gmtAllot',
                key: 'gmtAllot',
            },
            {
                title: <FormattedMessage id="ligiation.status" defaultMessage="诉讼状态" />,
                key: 'statusName',
                render: (text, record) => this.renderStateName(record)
            },
            {
                title: <FormattedMessage id="global.operate" defaultMessage="操作" />,
                render: (text, record) => this.renderOperate(record)
            }]
        return columns;
    }

    render() {
        let { intl, isFetch, total, lawyerBrand, ligitaionList, ligiationStatus } = this.props
        let { brandId, clueName, status, suitNo, startDate, endDate } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.thread.litigation.management', title: '线索诉讼案件管理'},
            { link: '', titleId: 'router.litigation.case.management', title: '诉讼案件管理' },
        ];
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form thread">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: 'ligiation.proceedings.number', defaultMessage: "诉讼案件编号" })}>
                                <Input
                                    placeholder={intl.formatMessage({ id: 'ligiation.please.enter.the.clue.number', defaultMessage: '请输入诉讼案件编号' })}
                                    onChange={(e) => this.handleChange(e.target.value.trim(), 'suitNo')}
                                    value={suitNo}
                                    onPressEnter={(e) => this.handleSearch()}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: 'thread.clue.name', defaultMessage: "线索名称" })}>
                                <Input
                                    placeholder={intl.formatMessage({ id: 'thread.plaese.enter.a.clue.name', defaultMessage: '请输入线索名称' })}
                                    onChange={(e) => this.handleChange(e.target.value.trim(), 'clueName')}
                                    value={clueName}
                                    onPressEnter={(e) => this.handleSearch()} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
                                <DatePicker
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')}
                                    value={startDate}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
                                <DatePicker
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')}
                                    value={endDate} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "monitor.picture.rule.brand", defaultMessage: "所属品牌", description: "所属品牌" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "monitor.picture.rule.choose.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    value={brandId}
                                    onChange={(value) => this.handleChange(value, 'brandId')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        lawyerBrand && lawyerBrand.filter(item => item.isDelete === 0)
                                            .map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "ligiation.status", defaultMessage: "诉讼状态", description: "诉讼状态" })}>
                                <Select
                                    value={status}
                                    dropdownMatchSelectWidth={false}
                                    onChange={(value) => this.handleChange(value, 'status')}
                                    placeholder={intl.formatMessage({ id: "ligiation.please.select.the.clue.status", defaultMessage: "请选择诉讼状态", description: "请选择状态" })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        ligiationStatus && ligiationStatus.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.dictVal}>{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6} offset={6}>
                            <div className="search-form-btns">
                                <Button type="primary" onClick={() => this.handleSearch()}>
                                    <FormattedMessage id="global.search" defaultMessage="搜索" />
                                </Button>
                                <Button onClick={() => this.handleReset()}>
                                    <FormattedMessage id="global.reset" defaultMessage="重置" />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table
                    dataSource={ligitaionList}
                    columns={this.createColumns()}
                    pagination={this.createPaginationOption()}
                    rowKey='id' loading={isFetch}
                />
            </Content>
        )
    }
}
export default injectIntl(Litigation)
