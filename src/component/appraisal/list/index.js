import React, { Component } from 'react'
import { Form, Col, Row, Table, Input, Select, DatePicker, Button, Alert, message } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import { formatDateToMs, getButtonPrem, getName } from '../../../utils/util'
import InputNumber from '../../common/form/numberInput';
const Option = Select.Option;

export default class AppraisalList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10,
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            name: '',
            contactCompany: '',
            contactName: '',
            contactMobile: '',
            status: undefined,
            searchData: {
                name: '',
                contactCompany: '',
                contactName: '',
                contactMobile: '',
                status: '',
                startTime: '',
                endTime: ''
            }

        }
    }

    componentWillMount() {
        let { appraisalList, history } = this.props;
        if (!appraisalList.length || (appraisalList.length && history.action !== 'POP' && !history.location.query)) {
            this.getApprailList([], 1)
        }
    }

    // 获取数据
    getApprailList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData)
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getApprailList(oldList, data)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getApprailList([], 1)
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
        let { name, contactCompany, contactName, contactMobile, status, startTime, endTime, searchData } = this.state;
        searchData = {
            name: name,
            contactCompany: contactCompany,
            contactName: contactName,
            contactMobile: contactMobile,
            status: status === undefined ? '' :  status,
            startTime: startTime,
            endTime: endTime
        }
        this.setState({
            searchData
        }, () => this.getApprailList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            name: '',
            contactCompany: '',
            contactName: '',
            contactMobile: '',
            status: '',
            startTime: '',
            endTime: ''
        }
        this.setState({
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            name: '',
            contactCompany: '',
            contactName: '',
            contactMobile: '',
            status: undefined,
            searchData
        }, () => this.getApprailList([], 1))
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
            onChange: (page, pageSize) => this.getApprailList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 创建table配置
    createColumns() {
        let { history, intl } = this.props
        const columns = [{
            title: <FormattedMessage id="appraisal.case.name" defaultMessage="案件名称" description="案件名称" />,
            dataIndex: 'name',
            width: '15%',
            render: (text, record) => {
                let { permissionList } = this.props
                return(
                    getButtonPrem(permissionList, '008001003') ?
                    <a onClick={() => history.push(`/appraisal/detail?id=${record.id}`)}>{text}</a>
                    : <span style={{color:'#668fff'}}>{text}</span>
                )                
            }
        }, {
            title: <FormattedMessage id="appraisal.law.enforcement" defaultMessage="执法单位" description="执法单位" />,
            dataIndex: 'contactCompany',
            width: '15%'
        }, {
            title: <FormattedMessage id="appraisal.enforcement.officer" defaultMessage="执法人姓名" description="执法人姓名" />,
            dataIndex: 'contactName',
            width: '15%'
        }, {
            title: <FormattedMessage id="appraisal.law.phone" defaultMessage="执法人电话" description="执法人电话" />,
            dataIndex: 'contactMobile',
            width: '15%'
        }, {
            title: <FormattedMessage id="appraisal.law.time" defaultMessage="执法时间" description="执法时间" />,
            dataIndex: 'apparaisalTimeStr',
            width: '15%'
        }, {
            title: <FormattedMessage id="appraisal.please.state.law.enforcement" defaultMessage="执法状态" description="执法状态" />,
            dataIndex: 'status',
            width: '10%',
            render: (text, record) => (
                intl.locale === 'en'
                ? record.statusNameEn
                : record.statusName
            )
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            dataIndex: 'operate',
            width: '15%',
            render: (text, item) => this.renderOperate(item) 
        }];
        return columns;
    }
    
    renderOperate(item) {
        let { permissionList } = this.props
        return(
            item.status === 0 ? (
                getButtonPrem(permissionList, '008001002') ?
                    [
                        <a key='pass' onClick={() => this.updateApprailList(item, 'pass')}>
                            <FormattedMessage id="global.pass" defaultMessage="通过" description="通过" />
                        </a>,
                        <br key='br' />,
                        <a key='fail' onClick={() => this.updateApprailList(item, 'fail')}>
                            <FormattedMessage id="global.fail" defaultMessage="不通过" description="不通过" />
                        </a>
                    ] : ''
            ): ''
        )
    }
    // 更新审核状态
    updateApprailList(item, type) {
        let { appraisalList, intl, updateApprailList, appraisalLawStatus } = this.props;
        let status = 0
        if(type === 'pass'){
            status = 1
        } else {
            status = 2
        }
        let statusData = getName(appraisalLawStatus,status)
        let data = {
            id: item.id,
            status: status,
            statusName: statusData.dictLabel,
            statusNameEn: statusData.dictLabelEn
        }
        updateApprailList(data, appraisalList, () => {
            message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
        })
    }

    render() {
        let { intl, total, appraisalList, isFetch, appraisalLawStatus } = this.props;
        let { name, contactCompany, contactName, contactMobile, startDate, endDate, status } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.law.enforcement.management', title: '鉴定管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "appraisal.case.name", defaultMessage: "案件名称", description: "案件名称" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "appraisal.please.case.name", defaultMessage: "请输入案件名称", description: "请输入案件名称" })}
                                    value={name} onChange={e => this.setState({ name: e.target.value.trim() })} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "appraisal.law.enforcement", defaultMessage: "执法单位", description: "执法单位" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "appraisal.please.law.enforcement", defaultMessage: "请输入执法单位", description: "请输入执法单位" })}
                                    value={contactCompany} onChange={e => this.setState({ contactCompany: e.target.value.trim() })} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "appraisal.enforcement.officer", defaultMessage: "执法人姓名", description: "执法人姓名" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "appraisal.please.enforcement.officer", defaultMessage: "请输入执法人姓名", description: "请输入执法人姓名" })}
                                    value={contactName} onChange={e => this.setState({ contactName: e.target.value.trim() })} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "appraisal.law.phone", defaultMessage: "执法人电话", description: "执法人电话" })}>
                                <InputNumber
                                    onPressEnter={(e) => this.handleSearch()} 
                                    placeholder={intl.formatMessage({ id: "appraisal.please.law.phone", defaultMessage: "请输入执法人电话", description: "请输入执法人电话" })}
                                    value={contactMobile} 
                                    onChange={value => this.setState({ contactMobile: value.trim() })} 
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
                            <Form.Item label={intl.formatMessage({ id: "appraisal.please.state.law.enforcement", defaultMessage: "执法状态", description: "执法状态" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                    value={status}
                                    onChange={val => this.setState({ status: val })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        appraisalLawStatus && appraisalLawStatus.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                                {
                                                    intl.locale === 'en'
                                                        ? opt.dictLabelEn
                                                        : opt.dictLabel
                                                }
                                            </Option>)
                                    }
                                </Select>
                            </Form.Item>
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
                <Table dataSource={appraisalList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
            </Content>
        )
    }
}
