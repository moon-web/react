import React, { Component } from 'react'
import { Col, Row, Form, Input, Select, DatePicker, Button, message } from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import { formatDateToMs, getFormatDate, getButtonPrem } from '../../../utils/util'
const FormItem = Form.Item;
const SelectOption = Select.Option;

class SearchForm extends Component {
    constructor() {
        super();
        this.state = {
            userNameLikeOrMobile: '',
            reportType: undefined,
            brandId: undefined,
            platformType: undefined,
            queryUrl: '',
            auditStatus: undefined,
            reportSourceType: undefined,
            prodTypeId: undefined,
            gmtCreateStart: '',  // 查询开始时间
            startTimeMs: 0,
            startDate: null,
            gmtCreateEnd: '',  // 查询结束时间
            endTimeMs: 0,
            endDate: null,
            reportReasonId: undefined,
            trademarkId: undefined,
            reportCountStatus: undefined,
            storeName: '',
            remarkLikeRight: '',
            searchData: {
                userNameLikeOrMobile: '',
                reportType: '',
                brandId: '',
                platformType: '',
                queryUrl: '',
                auditStatus: '',
                reportSourceType: '',
                prodTypeId: '',
                gmtCreateStart: '',
                gmtCreateEnd: '',
                reportReasonId: '',
                trademarkId: '',
                storeName: '',
                reportCountStatus: '',
                remarkLikeRight: ''
            }
        }
    }

    componentWillMount() {
        this.formatData(this.props)
    }


    // 整理数据
    formatData(props) {
        let result = props.searchData;
        this.setState({
            reportType: result.reportType === '' ? undefined : result.reportType, // 查询举报类型
            platformType: result.platformType === '' ? undefined : result.platformType,
            brandId: result.brandId === '' ? undefined : result.brandId,
            userNameLikeOrMobile: result.userNameLikeOrMobile ? result.userNameLikeOrMobile : '',
            gmtCreateStart: result.gmtCreateStart ? result.gmtCreateStart : '',
            gmtCreateEnd: result.gmtCreateEnd ? result.gmtCreateEnd : '',
            auditStatus: result.auditStatus === '' ? undefined : result.auditStatus,
            startDate: result.gmtCreateStart ? moment(result.gmtCreateStart, "YYYY-MM-DD HH:mm:ss") : null,
            endDate: result.gmtCreateEnd ? moment(result.gmtCreateEnd, "YYYY-MM-DD HH:mm:ss") : null,
            queryUrl: result.queryUrl ? result.queryUrl : '',
            reportSourceType: result.reportSourceType === '' ? undefined : result.reportSourceType,
            prodTypeId: result.prodTypeId === '' ? undefined : result.prodTypeId,
            reportReasonId: result.reportReasonId === '' ? undefined : result.reportReasonId,
            trademarkId: result.trademarkId === '' ? undefined : result.trademarkId,
            storeName: result.storeName ? result.storeName : '',
            reportCountStatus: result.reportCountStatus === '' ? undefined : result.reportCountStatus,
            remarkLikeRight: result.remarkLikeRight ? result.remarkLikeRight : '',
            searchData: Object.assign({}, this.state.searchData, props.searchData)
        })
    }

    // 搜索
    handleSearch() {
        let { userNameLikeOrMobile, reportType, brandId, platformType, queryUrl, auditStatus, reportSourceType, prodTypeId, gmtCreateStart, gmtCreateEnd, reportReasonId, trademarkId, storeName, reportCountStatus, remarkLikeRight, searchData } = this.state;
        let { handleSearch } = this.props;
        let data = {
            userNameLikeOrMobile,
            reportType: reportType === undefined ? '' : reportType,
            brandId: brandId === undefined ? '' : brandId,
            platformType: platformType === undefined ? '' : platformType,
            queryUrl,
            auditStatus: auditStatus === undefined ? '' : auditStatus,
            reportSourceType: reportSourceType === undefined ? '' : reportSourceType,
            prodTypeId: prodTypeId === undefined ? '' : prodTypeId,
            gmtCreateStart: gmtCreateStart,
            gmtCreateEnd: gmtCreateEnd,
            reportReasonId: reportReasonId === undefined ? '' : reportReasonId,
            trademarkId: trademarkId === undefined ? '' : trademarkId,
            reportCountStatus: reportCountStatus === undefined ? '' : reportCountStatus,
            storeName,
            remarkLikeRight
        }
        this.setState({
            searchData: Object.assign({}, searchData, data)
        })
        if (handleSearch) {
            handleSearch(data)
        }
    }

    // 重置
    handleReset() {
        let { handleReset } = this.props;
        this.setState({
            userNameLikeOrMobile: '',
            reportType: undefined,
            brandId: undefined,
            platformType: undefined,
            queryUrl: '',
            auditStatus: undefined,
            reportSourceType: undefined,
            prodTypeId: undefined,
            gmtCreateStart: '',  // 查询开始时间
            startTimeMs: 0,
            startDate: null,
            gmtCreateEnd: '',  // 查询结束时间
            endTimeMs: 0,
            endDate: null,
            reportReasonId: undefined,
            trademarkId: undefined,
            reportCountStatus: undefined,
            storeName: '',
            remarkLikeRight: '',
            searchData: {
                userNameLikeOrMobile: '',
                reportType: '',
                brandId: '',
                platformType: '',
                queryUrl: '',
                auditStatus: '',
                reportSourceType: '',
                prodTypeId: '',
                gmtCreateStart: '',
                gmtCreateEnd: '',
                reportReasonId: '',
                trademarkId: '',
                storeName: '',
                reportCountStatus: '',
                remarkLikeRight: ''
            }
        })
        if (handleReset) {
            handleReset()
        }
    }

    // 需改state值
    changeState(key, val) {
        let { searchData } = this.state;
        if (key === 'reportCountStatus') {
            searchData.auditStatus = '';
            this.setState({
                auditStatus: undefined,
                searchData
            })
        } else if (key === 'auditStatus') {
            searchData.reportCountStatus = '';
            this.setState({
                reportCountStatus: undefined,
                searchData
            })
        }
        this.setState({
            [key]: val
        })
    }

    // 品牌筛选变化时
    handleChangeBrand(value) {
        this.setState({
            brandId: value
        }, () => {
            if (this.props.getReportReasonQueryList) {
                this.props.getReportReasonQueryList(value)
            }
            if (this.props.getTrademarkQueryList) {
                this.props.getTrademarkQueryList(value)
            }
        })
    }

    // 模糊搜索举报理由
    handleSearchReportReason(val) {
        let { brandId } = this.state;
        if (this.props.getReportReasonQueryList) {
            this.props.getReportReasonQueryList(brandId, val)
        }
    }

    // 模糊搜索商标
    handleSearchTrademark(val) {
        let { brandId } = this.state;
        if (this.props.getTrademarkQueryList) {
            this.props.getTrademarkQueryList(brandId, val)
        }
    }

    // 选择日期
    changeDatePicker(date, dateStr, type) {
        let { startTimeMs, endTimeMs } = this.state;
        if (type === 'gmtCreateStart') {
            startTimeMs = formatDateToMs(dateStr);
        } else if (type === 'gmtCreateEnd') {
            endTimeMs = formatDateToMs(dateStr)
        }
        if (endTimeMs && (endTimeMs - startTimeMs < 0)) {
            let { intl } = this.props;
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range' }));
            return
        }
        if (type === 'gmtCreateStart') {
            this.setState({
                startTimeMs,
                gmtCreateStart: dateStr,
                startDate: date
            })
        } else {
            this.setState({
                endTimeMs,
                gmtCreateEnd: dateStr,
                endDate: date
            })
        }
    }

    // 对比数据 
    compareData(operation) {
        // 如果查询条件与页面显示条件不一致则提示搜索
        let { searchData, userNameLikeOrMobile, reportType, brandId, platformType, queryUrl, auditStatus, reportSourceType, prodTypeId, gmtCreateStart, gmtCreateEnd, reportReasonId, trademarkId, storeName, reportCountStatus, remarkLikeRight } = this.state;
        if (
            (searchData.userNameLikeOrMobile !== userNameLikeOrMobile) 
            || ( reportType !== undefined && searchData.reportType !== reportType) 
            || (brandId !== undefined && searchData.brandId !== brandId)
            || (platformType !== undefined && searchData.platformType !== platformType)
            || (searchData.queryUrl !== queryUrl)
            || (auditStatus !== undefined && searchData.auditStatus !== auditStatus)
            || (reportSourceType !== undefined && searchData.reportSourceType !== reportSourceType)
            || (prodTypeId !== undefined && searchData.prodTypeId !== prodTypeId)
            || (searchData.gmtCreateStart !== gmtCreateStart)
            || (searchData.gmtCreateEnd !== gmtCreateEnd)
            || (reportReasonId !== undefined && searchData.reportReasonId !== reportReasonId)
            || (trademarkId !== undefined && searchData.trademarkId !== trademarkId)
            || (searchData.storeName !== storeName)
            || (reportCountStatus !== undefined && searchData.reportCountStatus !== reportCountStatus)
            || (searchData.remarkLikeRight !== remarkLikeRight)
        ) {
            message.info('当前条件与查询条件不一致，请搜索后操作。')
            return;
        }
        let { handleOperation, showExportExcelModal } = this.props;
        if (operation === 'audit') {
            handleOperation && handleOperation()
        } else if (operation === 'export') {
            showExportExcelModal && showExportExcelModal()
        }
    }

    render() {
        let { intl, reportType: reportTypeList, brandList, platfromList, reportConfirmationStatus, reportResourceType, prodList, reportReasonQueryList, tardemarkQueryList, volunteerReportStatisticStatus, permissionList } = this.props;
        let { userNameLikeOrMobile, reportType, brandId, platformType, queryUrl, auditStatus, reportSourceType, prodTypeId, startDate, endDate, reportReasonId, trademarkId, storeName, reportCountStatus, remarkLikeRight } = this.state;
        return (
            <div>
                <div className="search-form">
                    <Row>                        
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "global.platform", defaultMessage: "所在平台", description: "所在平台" })}
                            >
                                <Select
                                    showSearch
                                    value={platformType}
                                    onChange={(e) => this.changeState('platformType', e)}
                                    placeholder={intl.formatMessage({ id: "report.please.select.the.platform", defaultMessage: "请选择所在平台", description: "请选择所在平台" })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <SelectOption value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </SelectOption>
                                    {
                                        platfromList && platfromList.filter(item => item.isDel === 0)
                                            .map(opt => <SelectOption key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</SelectOption>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "report.subordinate.to.the.brand", defaultMessage: "所属品牌", description: "所属品牌" })}
                            >
                                <Select
                                    showSearch
                                    value={brandId}
                                    dropdownMatchSelectWidth={true}
                                    onChange={val => this.handleChangeBrand(val)}
                                    placeholder={intl.formatMessage({ id: "report.please.select.your.own.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <SelectOption value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </SelectOption>
                                    {
                                        brandList && brandList.filter(item => item.isDelete === 0)
                                            .map(opt => <SelectOption key={opt.id} value={opt.id}>{opt.name}</SelectOption>)
                                    }
                                </Select>
                            </FormItem>
                        </Col> 
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "report.report.type", defaultMessage: "举报类型", description: "举报类型" })}
                            >
                                <Select
                                    value={reportType}
                                    onChange={(e) => this.changeState('reportType', e)}
                                    placeholder={intl.formatMessage({ id: "report.please.select.report.type", defaultMessage: "请选择举报类型", description: "请选择举报类型" })}
                                >
                                    <SelectOption value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </SelectOption>
                                    {
                                        reportTypeList && reportTypeList.filter(item => item.isDel === 0)
                                            .map(opt => <SelectOption key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</SelectOption>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>                      
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "report.to.report.status", defaultMessage: "举报状态", description: "举报状态" })}
                            >
                                <Select
                                    showSearch
                                    value={auditStatus}
                                    onChange={(e) => this.changeState('auditStatus', e)}
                                    placeholder={intl.formatMessage({ id: "report.please.select.report.status", defaultMessage: "请选择举报状态", description: "请选择举报状态" })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <SelectOption value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </SelectOption>
                                    {
                                        reportConfirmationStatus && reportConfirmationStatus.filter(item => item.isDel === 0)
                                            .map(opt => <SelectOption key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</SelectOption>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>                        
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "report.trademark", defaultMessage: "商标", description: "商标" })}
                            >
                                <Select
                                    showSearch
                                    value={trademarkId}
                                    dropdownMatchSelectWidth={true}
                                    filterOption={false}
                                    defaultActiveFirstOption={false}
                                    onSearch={val => this.handleSearchTrademark(val)}
                                    onChange={(e) => this.changeState('trademarkId', e)}
                                    placeholder={intl.formatMessage({ id: "report.please.select.trademark", defaultMessage: "请选择商标", description: "请选择商标" })}
                                >
                                    <SelectOption value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </SelectOption>
                                    {
                                        tardemarkQueryList && tardemarkQueryList.filter(item => item.isDel === 0)
                                            .map(opt => <SelectOption key={opt.id} value={opt.id}>{opt.vrLabel}</SelectOption>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "global.prod.url", defaultMessage: "商品链接", description: "商品链接" })}
                            >
                                <Input
                                    value={queryUrl}
                                    onPressEnter={(e) => this.handleSearch()}
                                    onChange={e => this.changeState('queryUrl', e.target.value.trim())}
                                    placeholder={intl.formatMessage({ id: "global.please.enter.prod.url", defaultMessage: "请输入商品链接", description: "请输入商品链接" })}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "report.category", defaultMessage: "商品类目", description: "商品类目" })}
                            >
                                <Select
                                    showSearch
                                    value={prodTypeId}
                                    dropdownMatchSelectWidth={true}
                                    onChange={(e) => this.changeState('prodTypeId', e)}
                                    placeholder={intl.formatMessage({ id: "report.please.select.torts.goods.category", defaultMessage: "请选择商品类目", description: "请选择商品类目" })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <SelectOption value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </SelectOption>
                                    {
                                        prodList && prodList.filter(item => item.isDel === 0)
                                            .map(opt => <SelectOption key={opt.id} value={opt.id}>{intl.locale === 'zh' ? opt.name : opt.nameEn}</SelectOption>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "report.report.reason", defaultMessage: "举报理由", description: "举报理由" })}
                            >
                                <Select
                                    showSearch
                                    value={reportReasonId}
                                    filterOption={false}
                                    dropdownMatchSelectWidth={true}
                                    defaultActiveFirstOption={false}
                                    onSearch={val => this.handleSearchReportReason(val)}
                                    onChange={(e) => this.changeState('reportReasonId', e)}
                                    placeholder={intl.formatMessage({ id: "report.please.select.report.reason", defaultMessage: "请选择举报理由", description: "请选择举报理由" })}
                                >
                                    <SelectOption value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </SelectOption>
                                    {
                                        reportReasonQueryList && reportReasonQueryList.filter(item => item.isDel === 0)
                                            .map(opt => <SelectOption key={opt.id} value={opt.id}>{opt.vrLabel}</SelectOption>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "report.source.type", defaultMessage: "举报来源", description: "举报来源" })}
                            >
                                <Select
                                    showSearch
                                    value={reportSourceType}
                                    placeholder={intl.formatMessage({ id: "report.please.select.report.source", defaultMessage: "请选择举报来源", description: "请选择举报来源" })}
                                    onChange={(e) => this.changeState('reportSourceType', e)}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <SelectOption value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </SelectOption>
                                    {
                                        reportResourceType && reportResourceType.filter(item => item.isDel === 0 && item.dictVal !== 2)
                                            .map(opt => <SelectOption key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</SelectOption>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "monitor.storeName", defaultMessage: "店铺名称", description: "店铺名称" })}
                            >
                                <Input
                                    value={storeName}
                                    onPressEnter={(e) => this.handleSearch()}
                                    onChange={e => this.changeState('storeName', e.target.value.trim())}
                                    placeholder={intl.formatMessage({ id: "monitor.input.storeName", defaultMessage: "请输入店铺名称", description: "请输入店铺名称" })}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "report.state.of.statistical", defaultMessage: "统计状态", description: "统计状态" })}
                            >
                                <Select
                                    showSearch
                                    value={reportCountStatus}
                                    onChange={(e) => this.changeState('reportCountStatus', e)}
                                    placeholder={intl.formatMessage({ id: "report.please.select.the.statistical.state", defaultMessage: "请选择统计状态", description: "请选择统计状态" })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <SelectOption value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </SelectOption>
                                    {
                                        volunteerReportStatisticStatus && volunteerReportStatisticStatus.filter(item => item.isDel === 0)
                                            .map(opt => <SelectOption key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</SelectOption>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>                        
                        <Col span={6}>
                            <FormItem
                                label={intl.formatMessage({ id: "report.reporter", defaultMessage: "举报人", description: "举报人" })}
                            >
                                <Input
                                    value={userNameLikeOrMobile}
                                    onPressEnter={(e) => this.handleSearch()}
                                    placeholder={intl.formatMessage({ id: "report.please.enter.userName", defaultMessage: "请输入用户名", description: "请输入用户名" })}
                                    onChange={e => this.changeState('userNameLikeOrMobile', e.target.value.trim())}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="time-row">
                            <Form.Item  label={intl.formatMessage({ id: "brand.start.time", defaultMessage: "举报时间", description: "举报时间" })}>
                                <Row>
                                    <Col span={11}>
                                        <DatePicker
                                            value={startDate}
                                            style={{ width: 'auto' }}
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'gmtCreateStart')}
                                        />
                                    </Col>
                                    <Col span={2} className="time-span-2">~</Col>
                                    <Col span={11}>
                                        <DatePicker
                                            value={endDate}
                                            style={{ width: 'auto' }}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'gmtCreateEnd')}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>                            
                        </Col> 
                        <Col span={6}>
                            <Form.Item
                                label={intl.formatMessage({ id: "case.note", defaultMessage: "备注", description: "备注" })}
                            >
                                <Input
                                    value={remarkLikeRight}
                                    onPressEnter={(e) => this.handleSearch()}
                                    onChange={e => this.changeState('remarkLikeRight', e.target.value.trim())}
                                    placeholder={intl.formatMessage({ id: "report.please.enter.note", defaultMessage: "请输入备注", description: "请输入备注" })}
                                />
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
                <Row className="operation-btns">
                    <Col span={24}>
                        {
                            getButtonPrem(permissionList, '004001004') ?
                                <Button type="primary" onClick={() => this.compareData('audit')}>
                                    <FormattedMessage id="global.batch.audit" defaultMessage="批量审核" description="批量审核" />
                                </Button> : ''
                        }
                        {
                            getButtonPrem(permissionList, '004001003')
                                ? <Button onClick={() => this.compareData('export')}>
                                    <FormattedMessage id="global.export" defaultMessage="导出" description="导出" />
                                </Button>
                                : ''
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

export default injectIntl(SearchForm);