import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Col, Row, Table, Input, Button, Alert, message, Select, DatePicker } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import Content from '../../../common/layout/content/index'
import { getButtonPrem, formatDateToMs } from '../../../../utils/util'
import moment from 'moment'
const Option = Select.Option
class OfflineCaseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            brandId: undefined,
            status: undefined,
            caseNo: '',
            clueName: '',
            startTimeMs: '',
            startTime: '',
            startDate: null,
            endTimeMs: '',
            endTime: '',
            endDate: null,
            clueType: undefined,
            caseType: undefined,
            searchData: {
                brandId: '',
                status: '',
                caseNo: '',
                clueName: '',
                gmtStart: '',
                gmtEnd: '',
                clueType: '',
                caseType: ''
            }
        }
    }

    componentWillMount() {
        let { offlineCaseList, history } = this.props;
        if (!offlineCaseList.length || (offlineCaseList.length && history.action !== 'POP' && !history.location.query)) {
			this.getOfflineCaseList([], 1)
		}else {
            let { searchData } = this.props
            let { brandId, status, caseNo, clueName, gmtStart, gmtEnd, clueType, caseType } = this.props.searchData
            let data = Object.assign({}, searchData)
            this.setState({
                searchData: data,
                brandId: brandId ? brandId : undefined,
                status: status !== '' ? status : undefined,
                caseNo,
                clueName,
                startTime: gmtStart,
                endTime: gmtEnd,
                startDate: gmtStart ? moment(gmtStart, "YYYY-MM-DD") : null,
                endDate: gmtEnd ? moment(gmtEnd, "YYYY-MM-DD") : null,
                clueType: clueType ? clueType : undefined,
                caseType: caseType ? caseType : undefined,
            })
        } 
    }

    // //获取数据
    getOfflineCaseList(oldThreadListData, pageNo) {
        let { searchData, pageSize } = this.state
        let { getOfflineCaseListData } = this.props
        let data = Object.assign({}, searchData);
        data.pageNo = pageNo
        data.pageSize = pageSize
        getOfflineCaseListData(data, oldThreadListData)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getOfflineCaseList([], 1)
        })
    }

    // 搜索
    handleSearch() {
        let { brandId, status, caseNo, clueName, startTime, endTime, clueType, caseType } = this.state;
        let searchData = {
            brandId: brandId ? brandId : '',
            status: status === undefined ? '' : status,
            caseNo,
            clueName,
            gmtStart: startTime ? startTime : '',
            gmtEnd: endTime ? endTime : '',
            clueType: clueType ? clueType : '',
            caseType: caseType ? caseType : ''
        }
        this.setState({
            searchData
        }, () => this.getOfflineCaseList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            brandId: '',
            status: '',
            caseNo: '',
            clueName: '',
            gmtStart: '',
            gmtEnd: '',
            clueType: '',
            caseType: ''
        }
        this.setState({
            brandId: undefined,
            status: undefined,
            caseNo: '',
            clueName: '',
            startTime: '',
            endTime: '',
            searchData,
            startTimeMs: '',
            startDate: null,
            endTimeMs: '',
            endDate: null,
            caseType: undefined,
            clueType: undefined,
            pageSize: 10,
            pageNo: 1,
        }, () => this.getOfflineCaseList([], 1))
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
            onChange: (page, pageSize) => this.getOfflineCaseList([], page),
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
        if ( (record.status === 0 || record.status === 3 ) && getButtonPrem(permissionList, '019001003')) {
            return (
                <Link to={`/thread/offlinecaselist/detail?cid=${record.id}`}>
                    <FormattedMessage id="offline.case.task" defaultMessage="作业" description="作业" />
                </Link>
            )
        }else{
            return (
                <Link to={`/thread/offlinecaselist/detail?cid=${record.id}`}>
                    <FormattedMessage id="ligiation.look" defaultMessage="查看" description="查看" />
                </Link>
            )
        }
    }

    renderStateName(record) {
        let { intl } = this.props;
        return (
            <div>
                {intl.locale === 'zh' ? record.statusName : record.statusNameEn}
                {
                    record.quitReason ? (
                        <p>
                            ({record.quitReason})
                        </p>
                    ):''
                }
                {
                    record.auditReason ? (
                        <p>
                            ({record.auditReason})
                        </p>
                    ):''
                }
            </div>
        )
    }

    // 创建table配置
    createColumns() {
        const columns = [
            {
                title: <FormattedMessage id="offline.case.proceedings.number" defaultMessage="线下案件编号" />,
                key: 'caseNo',
                dataIndex: 'caseNo'
            },
            {
                title: <FormattedMessage id="thread.clue.name" defaultMessage="线索名称" />,
                dataIndex: 'clueName',
                key: 'clueName',
            },
            {
                title: <FormattedMessage id="offline.case.clue.source" defaultMessage="线索来源" />,
                dataIndex: 'clueTypeName',
                key: 'clueTypeName',
            },
            {
                title: <FormattedMessage id="case.type" defaultMessage="案件类型" />,
                dataIndex: 'caseTypeName',
                key: 'caseTypeName',
            }, {
                title: <FormattedMessage id="monitor.picture.rule.brand" defaultMessage="所属品牌" />,
                dataIndex: 'brandName',
                key: 'brandName',
            },
            {
                title: <FormattedMessage id="global.start.time" defaultMessage="开始时间" />,
                dataIndex: 'gmtSend',
                key: 'gmtSend',
            },
            {
                title: <FormattedMessage id="global.status" defaultMessage="状态" />,
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
        let { intl, isFetch, total, lawyerBrand, offlineCaseList, offlineCaseType, offlineCaseClueType, offlineCaseStatusList } = this.props
        let { brandId, clueName, status, caseNo, startDate, endDate, clueType, caseType } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.thread.litigation.management', title: '线索诉讼案件管理'},
            { link: '', titleId: 'router.offline.case.management', title: '线下案件管理' },
        ];
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form thread">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: 'offline.case.proceedings.number', defaultMessage: "线下案件编号" })}>
                                <Input
                                    placeholder={intl.formatMessage({ id: 'offline.case.please.enter.the.number', defaultMessage: '请输入线下案件编号' })}
                                    onChange={(e) => this.handleChange(e.target.value.trim(), 'caseNo')}
                                    value={caseNo}
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
                            <Form.Item label={intl.formatMessage({ id: "global.status", defaultMessage: "状态", description: "状态" })}>
                                <Select
                                    value={status}
                                    dropdownMatchSelectWidth={false}
                                    onChange={(value) => this.handleChange(value, 'status')}
                                    placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        offlineCaseStatusList && offlineCaseStatusList.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.dictVal}>{ intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "offline.case.clue.source", defaultMessage: "线索来源", description: "线索来源" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "offline.case.please.select.clue.source", defaultMessage: "请选择线索来源", description: "请选择线索来源" })}
                                    value={clueType}
                                    onChange={(value) => this.handleChange(value, 'clueType')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        offlineCaseClueType && offlineCaseClueType.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.dictVal}>{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "case.type", defaultMessage: "案件类型", description: "案件类型" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "case.please.please.choose.the.type.of.case", defaultMessage: "请选择案件类型", description: "请选择案件类型" })}
                                    value={caseType}
                                    onChange={(value) => this.handleChange(value, 'caseType')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        offlineCaseType && offlineCaseType.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.dictVal}>{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
                                    }
                                </Select>
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
                        <Col span={6} offset={18}>
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
                    dataSource={offlineCaseList}
                    columns={this.createColumns()}
                    pagination={this.createPaginationOption()}
                    rowKey='id' loading={isFetch}
                />
            </Content>
        )
    }
}
export default injectIntl(OfflineCaseList)
