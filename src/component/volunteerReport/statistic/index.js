import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl'
import { Form, Input, Button, Row, Col, Select, Table, Alert, DatePicker, message, Pagination } from 'antd';
import Content from '../../common/layout/content/index'
import { formatDateToMs, getButtonPrem, getName, getFormatDate } from '../../../utils/util'
import ExcelExportModal from '../../common/layout/modal/exportExcelModal'
import moment from 'moment';
import './index.css'
const Option = Select.Option;

export default class ReportTask extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
            records: 0,//数据总条数
            current: 1,
            pageNo: 1,
            pageSize: 10,
            loading: false,
            userId: '',
            brandData: [],//品牌
            brand: undefined,//品牌
            userNameLikeOrMobile: '',//志愿者
            time: undefined,
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            vSuccNum: '',
            vTotalNum: '',
            weekTime: [],
            deliverTarget: '',//交付量
            deliverUnitStr: '',//交付单位
            startDateStr: '',//开始周期
            endDateStr: '',//结束周期
            isBlock: false,//显示交付
            searchData: {
                // 搜索数据
                brandId: '',
                userNameLikeOrMobile: '',
                beginDate: '',
                endDate: ''
            },
            brandList: [],
            sortFlag: 0,
            sort: '',
            sorterInfo: {},
            sortOrder: false,
            visibleExcelExport: false,  // 自定义导出数据的弹窗控制
            autoTitleParam: [],  //  自定义数据
            autoPageNum: 100,  // 自定义数据量
            tbName: '志愿者举报统计-'+getFormatDate('yyyy-MM-dd-hh:mm')
        }
    }

    //获取数据
    getDataList(pageNo) {
        let { getReportStatisticList, getCountReportdata } = this.props
        let { searchData, pageSize, sortFlag, sort } = this.state;
        let data = Object.assign({}, searchData)
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        data.sortFlag = sortFlag;
        data.sort = sort;
        getReportStatisticList(data)
        getCountReportdata(data)
    }

    componentWillMount() {
        let { startDateStr, isBlock, endDateStr, brandList, history } = this.props
        if (history.location.query) {
            let data = history.location.query.record;
            this.setState({
                brandId: data.id,
                deliverTarget: data.deliverTarget,//交付量
                deliverUnitStr: data.deliverUnit,//交付单位
                endDateStr: data.gmtEndStr,
                startDateStr: data.gmtStartStr,
                endTime: data.gmtEndStr,//开始周期
                startTime: data.gmtStartStr,//结束周期
                isBlock: isBlock,
                startDate: data.gmtStartStr ? JSON.stringify(startDateStr) : null,
                endDate: endDateStr ? JSON.stringify(endDateStr) : null,
            })
            this.getBrandName(data.id ? data.id : data.id || '')
        } else if (brandList.length) {
            this.setState({
                brandId: brandList && brandList.length > 0 ? brandList[0].id : ""
            }, () => {
                this.getBrandName(this.state.brandId)
            })
        }
        if (this.props.getExportExcelTitle) {
            this.props.getExportExcelTitle({excelType: 10})
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.brandList !== this.props.brandList) {
            this.setState({
                brandId: nextProps.brandList && nextProps.brandList.length > 0 ? nextProps.brandList[0].id : "",
                isBlock: nextProps.isBlock,
                startDate: nextProps.gmtStartStr ? JSON.stringify(nextProps.gmtStartStr) : null,
                endDate: nextProps.gmtEndStr ? JSON.stringify(nextProps.gmtEndStr) : null,
            }, () => {
                this.getBrandName(this.state.brandId)
            })
        }
    }

    // 显示自定义导出弹窗
    showExportExcelModal() {
        let result = localStorage.getItem('excelImport');
        let { exportExcelTitle } = this.props;
        if (result) {
            result = JSON.parse(result);
            if (!result.reportStatistical) {
                let autoTitleParam = [];
                for (let i = 0; i < exportExcelTitle.length; i++) {
                    const element = exportExcelTitle[i];
                    if (element.excelType === 10) {
                        autoTitleParam.push(element.num)
                    }
                }
                this.setState({
                    autoTitleParam,
                    visibleExcelExport: true
                })
            } else {
                this.setState({
                    autoTitleParam: result.reportStatistical,
                    visibleExcelExport: true
                })
            }
        } else if (!result) {
            let autoTitleParam = [];
            for (let i = 0; i < exportExcelTitle.length; i++) {
                const element = exportExcelTitle[i];
                if (element.excelType === 10) {
                    autoTitleParam.push(element.num)
                }
            }
            this.setState({
                autoTitleParam,
                visibleExcelExport: true
            })
        }
    }

    // 确认导出
    confirmExcel(data) {
        let result = localStorage.getItem('excelImport');
        if (!result) {
            result = {}
        } else {
            result = JSON.parse(result);
        }
        result.reportStatistical = data.autoTitleParam;
        localStorage.setItem('excelImport', JSON.stringify(result))
        this.setState({
            autoTitleParam: data.autoTitleParam,
            autoPageNum: data.autoPageNum,
            tbName: data.tbName,
            visibleExcelExport: false
        }, () => {
            this.exportExcel()
        })
    }

    // 导出
    exportExcel() {
        let { searchData, autoTitleParam, autoPageNum, tbName } = this.state;
        let { saveExcelData, brandList } = this.props;
        let queryParamStr = [];
        if (searchData.brandId) {
            let brandId = getName(brandList, searchData.brandId, 'brand');
            queryParamStr.push(`所属品牌:${brandId.name}`)
        }
        if (searchData.userNameLikeOrMobile) {
            queryParamStr.push(`志愿者:${searchData.userNameLikeOrMobile}`)
        }
        if (searchData.beginDate) {
            queryParamStr.push(`开始时间:${searchData.beginDate}`)
        }
        if (searchData.endDate) {
            queryParamStr.push(`结束时间:${searchData.endDate}`)
        }
        let data = {
            type: 1,
            excelType: 10,
            queryParam: JSON.stringify(searchData),
            queryParamStr: queryParamStr.toString(),
            autoTitleParam: autoTitleParam.toString(),
            autoPageNum,
            tbName
        }
        saveExcelData(data)
    }

    //获取品牌
    getBrandName(id) {
        let { userInfo } = this.props
        let data = {
            userId: userInfo.userId,
            brandId: id || ''
        }
        this.getBrandInfo(data)
    }

    //根据品牌获取交付数据
    getBrandInfo(data) {
        let { getbrandInfodata } = this.props
        getbrandInfodata(data, () => {
            let { startDateStr, endDateStr, isBlock } = this.props
            let { searchData } = this.state;
            searchData.beginDate = startDateStr ? startDateStr : '';
            searchData.endDate = endDateStr ? endDateStr : '';
            searchData.brandId = data.brandId;
            this.setState({
                startTime: startDateStr ? startDateStr : '',
                endTime: endDateStr ? endDateStr : '',
                startDate: startDateStr && startDateStr !== undefined ? JSON.stringify(startDateStr) : null,
                endDate: endDateStr && endDateStr !== undefined ? JSON.stringify(endDateStr) : null,
                isBlock: isBlock,
                searchData
            }, () => {
                this.getDataList(1)
            })
        })
    }


    //重置一组输入控件
    handleReset() {
        this.setState({
            pageNo: 1,
            pageSize: 10,
            current: 1,
            brandId: undefined,
            userNameLikeOrMobile: '',
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            time: [],
            isBlock: false,
            deliverTarget: '',//交付量
            deliverUnitStr: '',//交付单位
            startDateStr: '',//开始周期
            endDateStr: '',//结束周期
            sortFlag: 0,
            sort: '',
            sortOrder: false,
            searchData: {
                // 搜索数据
                brandId: '',
                userNameLikeOrMobile: '',
                beginDate: '',
                endDate: ''
            }
        }, () => {
            this.getDataList(1)
        })
    }

    // 搜索

    handleSearch() {
        let { searchData, brandId, userNameLikeOrMobile, startTime, endTime } = this.state;
        searchData.userNameLikeOrMobile = userNameLikeOrMobile;
        searchData.brandId = brandId === undefined ? '' : brandId;
        searchData.beginDate = startTime;
        searchData.endDate = endTime;
        this.setState({
            searchData
        }, () => this.getDataList(1))
    }


    //选择品牌
    handlebrandChange(value) {
        let { userInfo } = this.props
        this.setState({
            brandId: value,
            sortFlag: 0,
            sort: '',
            sorterInfo: {},
            sortOrder: false
        }, () => {
            let data = {
                userId: userInfo.userId,
                brandId: this.state.brandId || ''
            }
            this.getBrandInfo(data)
        })
    }

    // 选择日期
    changeDatePicker(date, dateStr, type, key) {
        // 搜索时间
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
    changePageSize(current, pageSize) {
        this.setState({
            pageSize: pageSize
        }, () => {
            this.getDataList(1)
        })
    }

    //创建分页器配置项
    createPaginationOption() {
        let { pageNo, total } = this.props;
        let { pageSize } = this.state;
        return {
            current: pageNo,
            pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    //表格排序触发
    handleTableChange = (pagination, filters, sorter) => {
        let sortFlag = 0, sort = '', sortOrder
        if (sorter) {
            if (sorter.order === 'ascend') {
                sort = 0
                sortOrder = 'ascend'
            } else if (sorter.order === 'descend') {
                sort = 1
                sortOrder = 'descend'
            } else {
                sort = ''
                sortFlag = 0
                sortOrder = false
            }
            if (sorter.columnKey === 'vTotalNum') {
                sortFlag = 1
            } else if (sorter.columnKey === 'auditNum') {
                sortFlag = 2
            } else if (sorter.columnKey === 'vSuccNum') {
                sortFlag = 3
            } else if (sorter.columnKey === 'noSuccNum') {
                sortFlag = 4
            } else if (sorter.columnKey === 'whatAudit') {
                sortFlag = 5
            }
            this.setState({
                sortFlag,
                sort,
                sortOrder,
                sorterInfo: sorter
            }, () => {
                this.getDataList(1)
            })
        }
    }


    //table成立量
    getsuccNum(text, record) {
        let { permissionList } = this.props
        return (
            <div>
                {
                    getButtonPrem(permissionList, '004001001') ?
                        <Link to={{
                            pathname: `/volunteer/report/List?userName=${record.userName}&brandId=${record.brandId}&startTime=${record.date} 00:00:00&endTime=${record.date} 23:59:59&reportCountStatus=1`,
                            query: {
                                userName: record.userName,
                                brandId: record.brandId,
                                date: record.date,
                                reportCountStatus: 1
                            }
                        }} target="_blank" className='resourceManageMainLinkWrap'>{record.vSuccNum === null ? '0' : record.vSuccNum}
                        </Link> : <span style={{ color: '#668fff' }}>{record.vSuccNum === null ? '0' : record.vSuccNum}</span>
                }
            </div>
        )
    }

    //table不成立量
    getNosuccNum(text, record) {
        let { permissionList } = this.props
        return (
            <div>
                {
                    getButtonPrem(permissionList, '004001001') ?
                        <Link to={{
                            pathname: `/volunteer/report/List?userName=${record.userName}&brandId=${record.brandId}&startTime=${record.date} 00:00:00&endTime=${record.date} 23:59:59&reportCountStatus=2`,
                            query: {
                                userName: record.userName,
                                brandId: record.brandId,
                                date: record.date,
                                reportCountStatus: 2
                            }
                        }} target="_blank" className='resourceManageMainLinkWrap'>{record.noSuccNum === null ? '0' : record.noSuccNum}</Link>
                        : <span style={{ color: '#668fff' }}>{record.noSuccNum === null ? '0' : record.noSuccNum}</span>
                }
            </div>
        )
    }

    //table待客审量
    getAuditNum(text, record) {
        let { permissionList } = this.props
        return (
            <div>
                {
                    getButtonPrem(permissionList, '004001001') ?
                        <Link to={{
                            pathname: `/volunteer/report/List?userName=${record.userName}&brandId=${record.brandId}&startTime=${record.date} 00:00:00&endTime=${record.date} 23:59:59&reportCountStatus=3`,
                            query: {
                                userName: record.userName,
                                brandId: record.brandId,
                                date: record.date,
                                reportCountStatus: 3
                            }
                        }} target="_blank" className='resourceManageMainLinkWrap'>{record.whatAudit === null ? '0' : record.whatAudit}
                        </Link>
                        : <span style={{ color: '#668fff' }}>{record.whatAudit === null ? '0' : record.whatAudit}</span>
                }
            </div>
        )
    }

    //准确率
    getCorrctRate(record) {
        return (
            <div>
                {record === 0 ? <div>{record.correctRate}</div> : <div>{record.correctRate}%</div>}
            </div>
        )
    }


    // 创建table配置
    createColumns() {
        let { sortOrder, sorterInfo } = this.state
        const columns = [{
            title: <span><FormattedMessage id="users.volunteer" defaultMessage="志愿者" description="志愿者" /></span>,
            key: 'userName',
            dataIndex: 'userName',
        }, {
            title: <span><FormattedMessage id="home.brand" defaultMessage="品牌" description="品牌" /></span>,
            key: 'brandName',
            dataIndex: 'brandName',
        }, {
            title: <span><FormattedMessage id="users.date" defaultMessage="日期" description="日期" /></span>,
            key: 'date',
            dataIndex: 'date',
        }, {
            title: <span><FormattedMessage id="report.totalSubmissions" defaultMessage="提交量" description="提交量" /></span>,
            key: 'vTotalNum',
            dataIndex: 'vTotalNum',
            sortOrder: sorterInfo.columnKey === 'vTotalNum' && sortOrder,
            sorter: true
        }, {
            title: <span><FormattedMessage id="report.audit.volume" defaultMessage="审核量" description="审核量" /></span>,
            key: 'auditNum',
            dataIndex: 'auditNum',
            sortOrder: sorterInfo.columnKey === 'auditNum' && sortOrder,
            sorter: true,
            render: (text, record) => <span>{record.auditNum ? record.auditNum : 0}</span>
        }, {
            title: <span><FormattedMessage id="users.accurateQuantity" defaultMessage="成立量" description="成立量" /></span>,
            key: 'vSuccNum',
            dataIndex: 'vSuccNum',
            sortOrder: sorterInfo.columnKey === 'vSuccNum' && sortOrder,
            sorter: true,
            render: (text, record) => this.getsuccNum(text, record)
        }, {
            title: <span><FormattedMessage id="users.invalidQuantity" defaultMessage="不成立量" description="不成立量" /></span>,
            dataIndex: 'noSuccNum',
            key: 'noSuccNum',
            sortOrder: sorterInfo.columnKey === 'noSuccNum' && sortOrder,
            sorter: true,
            render: (text, record) => this.getNosuccNum(text, record)
        }, {
            title: <span><FormattedMessage id="report.waiting.trial" defaultMessage="待客审量" description="待客审量" /></span>,
            key: 'whatAudit',
            dataIndex: 'whatAudit',
            sortOrder: sorterInfo.columnKey === 'whatAudit' && sortOrder,
            sorter: true,
            render: (text, record) => this.getAuditNum(text, record)
        }, {
            title: <span><FormattedMessage id="users.accuracy" defaultMessage="准确率" description="准确率" /></span>,
            key: 'correctRate',
            render: (text, record) => this.getCorrctRate(record)
        }];
        return columns;
    }

    render() {
        let { intl, reportStatisticList, isFetch, brandList, vSuccNum, vTotalNum, permissionList, pageNo, total, exportExcelTitle } = this.props
        let { brandId, userNameLikeOrMobile, startDate, endDate, isBlock, pageSize, visibleExcelExport, autoTitleParam, tbName } = this.state
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.volunteer.report.management', title: '志愿者举报管理' },
            { link: '', titleId: 'router.volunteer.report.statistics', title: '志愿者举报统计' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: 'home.brand', defaultMessage: "品牌", description: "品牌" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: 'report.users.pleaseChoose', defaultMessage: '请选择', description: '请选择' })}
                                    onChange={(value) => this.handlebrandChange(value)}
                                    value={brandId}
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
                        {
                            isBlock === true ? (
                                <Col span={16}>
                                    <div className="dateWrapper">
                                        <span className="dateinfo">
                                            <FormattedMessage id="report.current.delivery.target" defaultMessage="当前交付目标" description="当前交付目标" /> :
                                        </span>
                                        <div className="dateinfo"> {this.props.deliverTarget}/{this.props.deliverUnitStr === 1 ? '月' : '周'}</div>
                                    </div>
                                    <div className="dateWrapper">
                                        <span className="dateinfo">
                                            <FormattedMessage id="report.current.delivery.cycle" defaultMessage="当前交付周期" description="当前交付周期" /> :
                                        </span>
                                        <div className="dateinfo"> {this.props.startDateStr}~{this.props.endDateStr}</div>
                                    </div>
                                </Col>
                            ) : ''
                        }
                    </Row>
                    <Row>
                        <Col span={6}>

                            <Form.Item label={intl.formatMessage({ id: "users.volunteer", defaultMessage: '志愿者', description: '志愿者' })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: 'report.users.pleaseEnter', defaultMessage: "请输入", description: "请输入" })} value={userNameLikeOrMobile} onChange={(e) => this.setState({ userNameLikeOrMobile: e.target.value.trim() })} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
                                <DatePicker
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')}
                                    value={startDate ? moment(startDate, 'YYYY-MM-DD') : null} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
                                <DatePicker
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')}
                                    value={endDate ? moment(endDate, 'YYYY-MM-DD') : null} />
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
                <div className="operation-btns">
                    {
                        getButtonPrem(permissionList, '004002003')
                            ? <Button type='primary' onClick={() => this.showExportExcelModal()}>
                                <FormattedMessage id="global.export" defaultMessage="导出" description="导出" />
                            </Button>
                            : ''
                    }
                </div>
                <Alert message={
                    intl.formatMessage({
                        id: "users.totalsubmissions.accurateQuantity",
                        defaultMessage: `提交量 :（${vTotalNum === '' || vTotalNum === null ? '0' : vTotalNum}）成立量 : （${vSuccNum === '' || vSuccNum === null ? '0' : vSuccNum}）`,
                        description: `提交量 :（${vTotalNum === '' || vTotalNum === null ? '0' : vTotalNum}）成立量 : （${vSuccNum === '' || vSuccNum === null ? '0' : vSuccNum}）`
                    },
                        { vTotalNum: vTotalNum === '' || vTotalNum === null ? '0' : vTotalNum, vSuccNum: vSuccNum === '' || vSuccNum === null ? '0' : vSuccNum })}
                    type="info" showIcon
                    className="Alert_info"
                /> <Table
                    columns={this.createColumns()}
                    rowKey={record => record.id}
                    dataSource={reportStatisticList}
                    // pagination={this.createPaginationOption()}
                    pagination={false}
                    loading={isFetch}
                    onChange={this.handleTableChange}
                />
                <Pagination
                    onChange={(page) => this.getDataList(page)}
                    total={total}
                    current={pageNo}
                    pageSize={pageSize}
                    showQuickJumper
                    showSizeChanger
                    onShowSizeChange={(current, pageSize) => this.changePageSize(current, pageSize)}
                />
                <ExcelExportModal
                    onCancel={() => this.setState({ visibleExcelExport: false, autoTitleParam: [] })}
                    onOk={data => this.confirmExcel(data)}
                    visible={visibleExcelExport}
                    data={exportExcelTitle}
                    checkedData={autoTitleParam}
                    title={intl.formatMessage({ id: "global.export", defaultMessage: "导出", description: "导出" })}
                    total={total}
                    tbName={tbName}
                />
            </Content>
        )
    }
}