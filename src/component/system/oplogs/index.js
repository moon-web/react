import React, { Component } from 'react'
import { Form, Col, Row, Table, Input, Button, Alert, Select, DatePicker, message } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import { formatDateToMs } from '../../../utils/util'
const Option = Select.Option;


export default class Oplogs extends Component {
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
            userName: '',
            optType: undefined,
            optResult: undefined,
            searchData: {
                gmtOptStart: '',
                gmtOptEnd: '',
                userName: '',
                optType: '',
                optResult: ''
            }
        }
    }

    componentWillMount() {
        this.getSystemList([], 1)
    }

    // 获取数据
    getSystemList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData)
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getSystemList(data, oldList)
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
        let { searchData, userName, optType, optResult, startTime, endTime } = this.state;
        searchData = {
            userName: userName,
            optType: optType !== undefined ? optType : '',
            optResult: optResult !== undefined ? optResult : '',
            gmtOptStart: startTime,
            gmtOptEnd: endTime
        }
        this.setState({
            searchData
        }, () => this.getSystemList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            gmtOptStart: '',
            gmtOptEnd: '',
            userName: '',
            optType: '',
            optResult: ''
        }
        this.setState({
            userName: '',
            optType: undefined,
            optResult: undefined,
            startTime: '',
            startDate: null,
            startTimeMs: 0,
            endTime: '',
            endDate: null,
            endTimeMs: 0,
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

    // 创建table配置
    createColumns() {
        let { intl } = this.props
        const columns = [{
            title: <FormattedMessage id="system.operator" defaultMessage="操作人" description="操作人" />,
            key: 'userName',
            dataIndex: 'userName',
        }, {
            title: 'IP',
            key: 'optIp',
            dataIndex: 'optIp',
        }, {
            title: <FormattedMessage id="system.operator.type" defaultMessage="操作时间" description="操作时间" />,
            key: 'optType',
            dataIndex: 'optType',
            render: (text, item) => (
                intl.locale === 'en'
                    ? item.optTypeNameEn
                    : item.optTypeName
            )
        }, {
            title: <FormattedMessage id="system.operator.time" defaultMessage="操作时间" description="操作时间" />,
            key: 'gmtOpt',
            dataIndex: 'gmtOpt',
        }, {
            title: <FormattedMessage id="system.operator.description" defaultMessage="操作描述" description="操作描述" />,
            key: 'optContent',
            dataIndex: 'optContent',
        }, {
            title: <FormattedMessage id="system.operator.results" defaultMessage="操作结果" description="操作结果" />,
            key: 'optResult',
            dataIndex: 'optResult',
            render: (text, item) => (
                <div>
                    {
                        intl.locale === 'en'
                            ? <span>{item.optResultNameEn}</span>
                            : <span>{item.optResultName}</span>
                    }
                    <br />
                    {
                        item.optMsg
                            ? <span>({item.optMsg})</span>
                            : ''
                    }
                </div>
            )
        }];
        return columns;
    }

    render() {
        let { intl, isFetch, oplogsList, total, optlogTypeList, optlogResultTypeList } = this.props;
        let { userName, startDate, endDate, optType, optResult } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.system.operation.log', title: '系统操作日志' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.user.name", defaultMessage: "用户名", description: "用户名" })}>
                                <Input onPressEnter={(e) => this.handleSearch()}  placeholder={intl.formatMessage({ id: "system.please.enter.user.name", defaultMessage: "请输入用户名", description: "请输入用户名" })}
                                    onChange={e => this.setState({ userName: e.target.value.trim() })} value={userName} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.operator.type", defaultMessage: "操作类型", description: "操作类型" })}>
                                <Select
                                    value={optType}
                                    onChange={val => this.setState({ optType: val })}
                                    placeholder={intl.formatMessage({ id: "system.please.select.operator.type", defaultMessage: "请选择操作类型", description: "请选择操作类型" })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        optlogTypeList && optlogTypeList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
                                <DatePicker 
                                    showTime
                                    value={startDate} 
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style={{width: 'auto'}}
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')} 
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
                                <DatePicker 
                                    showTime
                                    value={endDate} 
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style={{width: 'auto'}}
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')} 

                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.operator.results", defaultMessage: "操作结果", description: "操作结果" })}>
                                <Select
                                    value={optResult}
                                    onChange={val => this.setState({ optResult: val })}
                                    placeholder={intl.formatMessage({ id: "system.please.select.operator.results", defaultMessage: "请选择操作结果", description: "请选择操作结果" })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        optlogResultTypeList && optlogResultTypeList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6} offset={12}>
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
                <Table dataSource={oplogsList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
            </Content>
        )
    }
}
