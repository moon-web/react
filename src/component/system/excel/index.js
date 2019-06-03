import React, { Component } from 'react'
import { Form, Button, Table, Select, Alert, Row, Col, message, DatePicker, Card, Pagination, Tooltip } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import { formatDateToMs, getButtonPrem } from '../../../utils/util'
const Option = Select.Option;

export default class ExcelExport extends Component {
    constructor() {
        super();
        this.state = {
            pageSize: 10,
            excelType: undefined,
            type: '1',
            status: undefined,
            startTime: '',
            startTimeMs: 0,
            startDate: null,
            endTime: '',
            endTimeMs: 0,
            endDate: null,
            searchData: {
                excelType: '',
                type: '1',
                status: '',
                startTime: '',
                endTime: ''
            }
        }
    }

    componentWillMount() {
        let { excelExportTypeList } = this.props;
        if (excelExportTypeList.length) {
            let { searchData } = this.state;
            searchData.type = excelExportTypeList[0].dictVal;
            this.setState({
                searchData,
                type: excelExportTypeList[0].dictVal.toString()
            }, () => {
                this.getExcelExportPage(1, [])
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.excelExportTypeList !== this.props.excelExportTypeList) {
            if (nextProps.excelExportTypeList.length) {
                let { searchData } = this.state;
                searchData.type = nextProps.excelExportTypeList[0].dictVal;
                this.setState({
                    searchData,
                    type: nextProps.excelExportTypeList[0].dictVal.toString()
                }, () => {
                    this.getExcelExportPage(1, [])
                })
            }
        }
    }

    // 搜索
    handleSearch() {
        let { excelType, type, status, startTime, endTime } = this.state;
        let searchData = {
            excelType: excelType === undefined ? '' : excelType,
            type: type === undefined ? '' : type,
            status: status === undefined ? '' : status,
            startTime,
            endTime
        }
        this.setState({
            searchData
        }, () => {
            this.getExcelExportPage(1, [])
        })
    }

    // 重置
    handleReset() {
        this.setState({
            excelType: undefined,
            status: undefined,
            startTime: '',
            startTimeMs: 0,
            startDate: null,
            endTime: '',
            endTimeMs: 0,
            endDate: null,
            type: '1',
            searchData: {
                excelType: '',
                status: '',
                startTime: '',
                endTime: '',
                type: '1'
            }
        }, () => {
            this.getExcelExportPage(1, [])
        })
    }

    // 改变excel type
    changeExcelType(key) {
        let { searchData } = this.state;
        searchData.type = key;
        this.setState({
            type: key,
            searchData
        }, () => {
            this.getExcelExportPage(1, [])
        })
    }

    // 下载文件
    downloadExcel(item) {
        if (item.excelUrl) {
            let link = document.createElement('a');
            link.setAttribute("download", item.excelName);
            link.setAttribute("href", item.excelUrl);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            let { excelCount, excelExportList } = this.props;
            if (excelCount) {
                excelCount({ id: item.id }, excelExportList)
            }
        } else {
            message.info('下载链接无效')
        }
    }

    // 获取数据
    getExcelExportPage(pageNo, oldList) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData)
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getExcelExportPage(data, oldList)
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
            this.getExcelExportPage(1, [])
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
            onChange: (page, pageSize) => this.getExcelExportPage(page, []),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 创建table配置
    createColumns() {
        let { intl, permissionList } = this.props
        const columns = [{
            title: <FormattedMessage id="system.operator" defaultMessage="操作人" description="操作人" />,
            key: 'userName',
            dataIndex: 'userName'
        }, {
            title: <FormattedMessage id="report.excel.name" defaultMessage="名称" description="名称" />,
            key: 'tbName',
            dataIndex: 'tbName',
            render: (text,record) => text ? text : record.excelName
        }, {
            title: <FormattedMessage id="system.query.params" defaultMessage="查询参数" description="查询参数" />,
            key: 'queryParamStr',
            dataIndex: 'queryParamStr',
            render: text => (
                text
                    ? text.length > 15
                        ? <Tooltip title={text}>{text.slice(0, 15)}...</Tooltip>
                        : text
                    : '-'
            )
        }, {
            title: <FormattedMessage id="system.operator.type" defaultMessage="操作类型" description="操作类型" />,
            key: 'excelType',
            dataIndex: 'excelType',
            render: (text, item) => (
                intl.locale === 'en'
                    ? item.excelTypeNameEn
                    : item.excelTypeName
            )
        }, {
            title: <FormattedMessage id="system.excel.type" defaultMessage="表格类型" description="表格类型" />,
            key: 'type',
            dataIndex: 'type',
            render: (text, item) => (
                intl.locale === 'en'
                    ? item.typeNameEn
                    : item.typeName
            )
        }, {
            title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
            key: 'status',
            dataIndex: 'status',
            render: (text, item) => (
                intl.locale === 'en'
                    ? item.statusNameEn
                    : item.statusName
            )
        }, {
            title: <FormattedMessage id="system.download.status" defaultMessage="下载状态" description="下载状态" />,
            key: 'isDownload',
            dataIndex: 'isDownload',
            render: (text, item) => (
                intl.locale === 'en'
                    ? item.isDownloadStrEn
                    : item.isDownloadStr
            )
        }, {
            title: <FormattedMessage id="system.create.tiem" defaultMessage="创建时间" description="创建时间" />,
            key: 'gmtCreate',
            dataIndex: 'gmtCreate'
        }, {
            title: <FormattedMessage id="system.custom.export.parameters" defaultMessage="自定义导出参数" description="自定义导出参数" />,
            key: 'autoTitleParam',
            dataIndex: 'autoTitleParam',
            render: text => (
                text 
                ? text.length > 8
                    ? <Tooltip placement="topLeft" title={text}>{text.slice(0, 8)}...</Tooltip>
                    : text
                : '-'
            )
        }, {
            title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
            key: 'optResult',
            dataIndex: 'optResult',
            render: (text, item) => {
                if (getButtonPrem(permissionList, '010014001') && item.status === 2 && item.isDownload !== 2) {
                    return (
                        <a onClick={() => this.downloadExcel(item)}><FormattedMessage id="global.download" defaultMessage="下载" description="下载" /></a>
                    )
                }
            }
        }];
        return columns;
    }

    render() {
        let { intl, total, excelExportList, isFetch, excelExportExcelTypeList, excelExportImportTypeList, excelExportTypeList, excelExportStatusList, pageNo } = this.props;
        let { excelType, type, status, startDate, endDate, pageSize } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.system.management', title: '系统管理' },
            { link: '', titleId: 'router.excel.export.management', title: '表格导出管理' }
        ]
        let excelTypeList = [];
        if (type === '0') {
            excelTypeList = excelExportImportTypeList;
        } else {
            excelTypeList = excelExportExcelTypeList;
        }
        let tabList = [];
        for (let i = 0; i < excelExportTypeList.length; i++) {
            const element = excelExportTypeList[i];
            let item = Object.assign({}, element);
            item.tab = intl.locale === 'en' ? element.dictLabelEn : element.dictLabel;
            item.key = element.dictVal.toString();
            tabList.push(item)
        }
        return (
            <Content breadcrumbData={breadcrumbData} className="monitor-result">
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "system.excel.type", defaultMessage: "表格类型", description: "表格类型" })}>
                                <Select
                                    value={excelType}
                                    onChange={val => this.setState({ excelType: val })}
                                    placeholder={intl.formatMessage({ id: "system.please.select.excel.type", defaultMessage: "请选择表格类型", description: "请选择表格类型" })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        excelTypeList && excelTypeList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.status", defaultMessage: "状态", description: "状态" })}>
                                <Select
                                    value={status}
                                    onChange={val => this.setState({ status: val })}
                                    placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        excelExportStatusList && excelExportStatusList.filter(item => item.isDel === 0)
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
                                    style={{ width: 'auto' }}
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
                                    style={{ width: 'auto' }}
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')}

                                />
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
                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Card
                    tabList={tabList}
                    activeTabKey={type}
                    onTabChange={key => this.changeExcelType(key)}
                >
                    <Table
                        dataSource={excelExportList}
                        columns={this.createColumns()}
                        pagination={false}
                        rowKey="id"
                        loading={isFetch}
                    />
                </Card>
                {
                    total > 0
                        ? (
                            <Pagination
                                onChange={(page) => this.getExcelExportPage(page, [])}
                                total={total}
                                current={pageNo}
                                pageSize={pageSize}
                                showQuickJumper
                                showSizeChanger
                                onShowSizeChange={(current, pageSize) => this.changePageSize(current, pageSize)}
                            />
                        )
                        : ''
                }
            </Content>
        )
    }
}
