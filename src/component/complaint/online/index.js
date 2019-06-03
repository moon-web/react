import React, { Component } from 'react'
import { Form, Col, Row, Table, Input, Select, DatePicker, Button, Alert, message, Upload, Tooltip } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import PictureModal from '../../common/layout/modal/pictureModal'
import Req from '../../../api/req'
import { formatDateToMs, getButtonPrem, getName, getFormatDate } from '../../../utils/util'
import ExcelExportModal from '../../common/layout/modal/exportExcelModal'
import './index.css'
const Option = Select.Option;
const FormItem = Form.Item;

export default class MonitorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 举报起止时间
            gmtMonitorS: '',
            gmtMonitorSMs: '',
            gmtMonitorSDate: null,
            gmtMonitorE: '',
            gmtMonitorEMs: '',
            gmtMonitorEDate: null,
            // 投诉起止时间
            gmtComplaintTimeS: '',
            gmtComplaintTimeSMs: '',
            gmtComplaintTimeSDate: null,
            gmtComplaintTimeE: '',
            gmtComplaintTimeEMs: '',
            gmtComplaintTimeEDate: null,

            brandId: undefined,  // 品牌
            platformId: undefined,  // 平台
            statusStrNumber: undefined,  // 状态
            dataFrom: undefined,  // 来源
            prodTypeId: undefined,
            nameOrmobile: '',  // 举报人
            monitorName: '',  // 监控规则
            queryUrl: '',   // 商品链接
            autoFlag: undefined, //自动投诉状态
            pageSize: 10,
            filterSendTimeEnd: '',//推送时间
            filterSendTimeEndDate: null,
            filterSendTimeEndMs: 0,
            filterSendTimeStart: '',
            filterSendTimeStartDate: null,
            filterSendTimeStartMs: 0,
            remarkLike: '',//备注
            searchData: {
                brandId: '',  // 品牌
                platformId: '',  // 平台
                statusStrNumber: '',  // 状态
                dataFrom: '',  // 来源
                nameOrmobile: '',  // 举报人
                monitorName: '',  // 监控规则
                // 投诉起止时间
                gmtComplaintTimeS: '',
                gmtComplaintTimeE: '',
                // 举报起止时间
                gmtMonitorS: '',
                gmtMonitorE: '',
                queryUrl: '',
                autoFlag: '',
                prodTypeId: '',
                remarkLike: '',
                filterSendTimeEnd: '',
                filterSendTimeStart: ''
            },
            showModalVisible: false,
            showModalImg: '',
            visibleExcelExport: false,  // 自定义导出数据的弹窗控制
            autoTitleParam: [],  //  自定义数据
            autoPageNum: 100,  // 自定义数据量
            tbName: '线上投诉-' + getFormatDate('yyyy-MM-dd-hh:mm'),
            smaill: true
        }
    }

    componentWillMount() {
        this.getOnlineList([], 1)
        if (this.props.getExportExcelTitle) {
            this.props.getExportExcelTitle({ excelType: 5 })
        }
    }

    // 获取数据
    getOnlineList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let data = Object.assign({}, searchData);
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        this.props.getOnlineList(data, oldList)
    }

    // 改变分页大小
    changePageSize(current, size) {
        this.setState({
            pageSize: size
        }, () => {
            this.getOnlineList([], 1)
        })
    }

    // 选择日期
    changeDatePicker(date, dateStr, type, source) {
        let startTimeMs = '', endTimeMs = '';
        //举报时间+++投诉时间
        if (type === 'S') {
            startTimeMs = formatDateToMs(dateStr);
            endTimeMs = formatDateToMs(this.state[source + 'E'])
        } else if (type === 'E') {
            startTimeMs = formatDateToMs(this.state[source + 'S']);
            endTimeMs = formatDateToMs(dateStr)
        }
        if (endTimeMs && (endTimeMs - startTimeMs < 0)) {
            let { intl } = this.props;
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range' }));
            return
        }
        if (type === 'S') {
            this.setState({
                [source + 'SMs']: startTimeMs,
                [source + 'S']: dateStr,
                [source + 'SDate']: date
            })
        } else if (type === 'E') {
            this.setState({
                [source + 'EMs']: startTimeMs,
                [source + 'E']: dateStr,
                [source + 'EDate']: date
            })
        }

        //推送时间
        let {filterSendTimeStartMs, filterSendTimeEndMs } = this.state;
        if (source === 'filterSendTimeStart') {
            startTimeMs = formatDateToMs(dateStr);
            endTimeMs = filterSendTimeEndMs;
        } else if (source === 'filterSendTimeEnd') {
            startTimeMs = filterSendTimeStartMs;
            endTimeMs = formatDateToMs(dateStr);
        }
        if (source === 'filterSendTimeStart') {
            this.setState({
                filterSendTimeStartMs: startTimeMs,
                filterSendTimeStart: dateStr,
                filterSendTimeStartDate: date
            })
        } else if (source === 'filterSendTimeEnd') {
            this.setState({
                filterSendTimeEndMs: endTimeMs,
                filterSendTimeEnd: dateStr,
                filterSendTimeEndDate: date
            })
        }
    }

    // 搜索
    handleSearch() {
        let { searchData, platformId, brandId, dataFrom, nameOrmobile, monitorName, statusStrNumber, 
            gmtComplaintTimeS, gmtComplaintTimeE, gmtMonitorS, gmtMonitorE, queryUrl, autoFlag, 
            prodTypeId, filterSendTimeStart, filterSendTimeEnd , remarkLike} = this.state;
        searchData = {
            platformId: platformId === undefined ? '' : platformId,
            brandId: brandId === undefined ? '' : brandId,
            dataFrom: dataFrom === undefined ? '' : dataFrom,
            statusStrNumber: statusStrNumber === undefined ? '' : statusStrNumber,
            nameOrmobile,
            monitorName,
            gmtComplaintTimeS,
            gmtComplaintTimeE,
            gmtMonitorS,
            gmtMonitorE,
            queryUrl: encodeURIComponent(queryUrl),
            autoFlag: autoFlag === undefined ? '' : autoFlag,
            prodTypeId: prodTypeId === undefined ? '' : prodTypeId,
            filterSendTimeStart:filterSendTimeStart,
            filterSendTimeEnd:filterSendTimeEnd,
            remarkLike,
        }
        this.setState({
            searchData
        }, () => this.getOnlineList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            platformId: '',
            brandId: '',
            dataFrom: '',
            nameOrmobile: '',
            monitorName: '',
            gmtComplaintTimeS: '',
            gmtComplaintTimeE: '',
            gmtMonitorS: '',
            gmtMonitorE: '',
            queryUrl: '',
            autoFlag: '',
            prodTypeId: '',
            filterSendTimeStart:'',
            filterSendTimeEnd:'',
            remarkLike:''
        }
        this.setState({
            platformId: undefined,
            brandId: undefined,
            dataFrom: undefined,
            statusStrNumber: undefined,
            prodTypeId: undefined,
            nameOrmobile: '',
            monitorName: '',
            gmtComplaintTimeS: '',
            gmtComplaintTimeSDate: null,
            gmtComplaintTimeE: '',
            gmtComplaintTimeEDate: null,
            gmtMonitorS: '',
            gmtMonitorSDate: null,
            gmtMonitorE: '',
            gmtMonitorEDate: null,
            queryUrl: '',
            autoFlag: undefined,
            filterSendTimeStart: '',//推送时间
            filterSendTimeStartDate: null,
            filterSendTimeStartMs: 0,
            filterSendTimeEnd: '',
            filterSendTimeEndDate: null,
            filterSendTimeEndMs: 0,
            remarkLike: '',
            searchData
        }, () => {
            this.getOnlineList([], 1)
        })
    }

    // 选择器选择
    handleSelectChange(value, key) {
        this.setState({
            [key]: value
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
            onChange: (page, pageSize) => this.getOnlineList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 更新审核状态
    updateMonitorItem(item, status) {
        let { userInfo, monitorList, intl } = this.props;
        let data = {
            userId: userInfo.userId,
            monitorId: item.monitorId,
            monitorStatus: status
        }
        this.props.updateMonitorItem(data, monitorList, () => {
            message.success(intl.formatMessage({ id: "global.operation.success", defaultMessage: "操作成功", description: "操作成功后的描述信息" }))
        })
    }

    // 显示自定义导出弹窗
    showExportExcelModal() {
        let result = localStorage.getItem('excelImport');
        let { exportExcelTitle } = this.props;
        if (result) {
            result = JSON.parse(result);
            if (!result.complaintOnline) {
                let autoTitleParam = [];
                for (let i = 0; i < exportExcelTitle.length; i++) {
                    const element = exportExcelTitle[i];
                    if (element.excelType === 5) {
                        autoTitleParam.push(element.num)
                    }
                }
                this.setState({
                    autoTitleParam,
                    visibleExcelExport: true
                })
            } else {
                this.setState({
                    autoTitleParam: result.complaintOnline,
                    visibleExcelExport: true
                })
            }
        } else if (!result) {
            let autoTitleParam = [];
            for (let i = 0; i < exportExcelTitle.length; i++) {
                const element = exportExcelTitle[i];
                if (element.excelType === 5) {
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
        result.complaintOnline = data.autoTitleParam;
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
        let { saveExcelData, onlineComplaintPlatformList, brandList, complaintStatusList, complaintSourceList, autoComplaintStatus, prodList } = this.props;
        let queryParamStr = [];
        if (searchData.platformId || searchData.platformId === 0) {
            let platform = getName(onlineComplaintPlatformList, searchData.platformId);
            queryParamStr.push(`平台:${platform.dictLabel}`)
        }
        if (searchData.brandId || searchData.brandId === 0) {
            let brandId = getName(brandList, searchData.brandId, 'brand');
            queryParamStr.push(`侵权品牌:${brandId.name}`)
        }
        if (searchData.statusStrNumber || searchData.statusStrNumber === 0) {
            let statusStrNumber = getName(complaintStatusList, searchData.statusStrNumber);
            queryParamStr.push(`状态:${statusStrNumber.dictLabel}`)
        }
        if (searchData.dataFrom || searchData.dataFrom === 0) {
            let dataFrom = getName(complaintSourceList, searchData.dataFrom);
            queryParamStr.push(`来源:${dataFrom.dictLabel}`)
        }
        if (searchData.nameOrmobile) {
            queryParamStr.push(`举报人:${searchData.nameOrmobile}`)
        }
        if (searchData.monitorName) {
            queryParamStr.push(`监控规则:${searchData.monitorName}`)
        }
        if (searchData.gmtComplaintTimeS) {
            queryParamStr.push(`投诉起始:${searchData.gmtComplaintTimeS}`)
        }
        if (searchData.gmtComplaintTimeE) {
            queryParamStr.push(`投诉截止:${searchData.gmtComplaintTimeE}`)
        }
        if (searchData.gmtMonitorS) {
            queryParamStr.push(`举报起始:${searchData.gmtMonitorS}`)
        }
        if (searchData.gmtMonitorE) {
            queryParamStr.push(`举报截止:${searchData.gmtMonitorE}`)
        }
        if (searchData.queryUrl) {
            queryParamStr.push(`商品链接:${searchData.queryUrl}`)
        }
        if (searchData.autoFlag || searchData.autoFlag === 0) {
            let autoFlag = getName(autoComplaintStatus, searchData.autoFlag);
            queryParamStr.push(`自动投诉状态:${autoFlag.dictLabel}`)
        }
        if (searchData.prodTypeId) {
            let prodType = getName(prodList, searchData.prodTypeId, 'prod');
            queryParamStr.push(`商品类别:${prodType.name}`)
        }
        if (searchData.filterSendTimeStart) {
            queryParamStr.push(`推送开始时间:${searchData.filterSendTimeStart}`)
        }
        if (searchData.filterSendTimeEnd) {
            queryParamStr.push(`推送截止时间:${searchData.filterSendTimeEnd}`)
        }
        if (searchData.remarkLike) {
            queryParamStr.push(`备注:${searchData.remarkLike}`)
        }
        let data = {
            type: 1,
            excelType: 5,
            queryParam: JSON.stringify(searchData),
            queryParamStr: queryParamStr.toString(),
            autoTitleParam: autoTitleParam.toString(),
            autoPageNum,
            tbName
        }
        saveExcelData(data)
    }

    // 导入
    importExcel({ file }) {
        if (file.status === 'done' && file.response.success) {
            let data = {
                type: 0,
                excelType: 3,
                excelUrl: file.response.dataObject,
                excelName: file.name
            };
            this.props.saveExcelData(data)
            // message.info(file.response.msg)
            this.getOnlineList([], 1)
        } else if (file.status === 'done' && !file.response.success) {
            message.info(file.response.msg)
        } else if (file.status === 'error') {
            message.info('导入失败，请稍后再试。')
        }
    }

    //显示页面截图
    showModalImg(imgUrl, isSmaill) {
        this.setState({
            showModalVisible: true,
            showModalImg: imgUrl.replace('_', ''),
            smaill: isSmaill
        })
    }
    handleCancelImg() {
        this.setState({
            showModalVisible: false,
            showModalImg: '',
            smaill: true
        })
    }

    // 渲染来源
    renderSource(item) {
        let { intl } = this.props
        return (
            <div className="table-info">
                <p className="table-item">
                    <span className="table-lable"><FormattedMessage id="complaint.source.type" defaultMessage="来源类型" description="来源类型" />: </span>
                    {intl.locale === 'zh' ? item.dataFromName : item.dataFromNameEn}
                </p>
                {
                    item.dataFrom === 1 || item.dataFrom === 8 || item.dataFrom === 9 || item.dataFrom === 12 ? '' :
                        [
                            <p className="table-item" key="1">
                                <span className="table-lable"><FormattedMessage id="report.reporter" defaultMessage="举报人" description="举报人" />: </span>
                                {item.name}
                            </p>,
                            <p className="table-item" key="2">
                                <span className="table-lable"><FormattedMessage id="complaint.reporter.mobile" defaultMessage="举报人手机" description="举报人手机" />: </span>
                                {item.userMobile}
                            </p>
                        ]
                }
                <p className="table-item">
                    <span className="table-lable"><FormattedMessage id="report.report.time" defaultMessage="举报时间" description="举报时间" />: </span>
                    {item.gmtComplaintTime}
                </p>
                <p className="table-item">
                    <span className="table-lable"><FormattedMessage id="global.audit.time" defaultMessage="审核时间" description="审核时间" />: </span>
                    {item.reportMgrAuditTime}
                </p>
                <p className="table-item">
                    <span className="table-lable"><FormattedMessage id="global.push.the.time" defaultMessage="推送时间" description="推送时间" />: </span>
                    {item.filterSendTime}
                </p>
                <p className="table-item">
                    <span className="table-lable"><FormattedMessage id="global.brand.side.confirms.time" defaultMessage="品牌方确认时间" description="品牌方确认时间" />: </span>
                    {item.gmtConfirm}
                </p>
            </div>
        )
    }

    // 渲染商品信息
    renderShops(item) {
        let { intl } = this.props
        return (

            <div className="table-info shops">
                <div className="shops-info">
                    <p className="table-item">
                        {
                            item.itemTitle
                                ? <a href={item.itemUrl} title={item.itemTitle} target='_blank'>{item.itemTitle}</a>
                                : <span className="item-link">
                                    <Tooltip placement="topLeft">
                                        <a href={item.itemUrl} title={item.itemUrl} target='_blank'>{item.itemUrl}</a>
                                    </Tooltip>
                                </span>
                        }
                    </p>
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="global.platform" defaultMessage="平台" description="平台" />: </span>
                        {intl.locale === 'zh' ? item.platform : item.platformEn}
                    </p>
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="monitor.price" defaultMessage="价格" description="价格" />: </span>
                        {item.price}
                    </p>
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="monitor.thirty.days.sales" defaultMessage="30天销量" description="30天销量" />: </span>
                        {item.salesVolume}
                    </p>
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="monitor.storeName" defaultMessage="店铺名称" description="店铺名称" />: </span>
                        {item.storeName}
                    </p>
                    {/* <p className="table-item">
                    <span className="table-lable"><FormattedMessage id="complaint.wangwang.id" defaultMessage="旺旺ID" description="旺旺ID" />: </span>
                    {item.sellerNick}
                </p> */}
                    <p className="table-item">
                        <span className="table-lable"><FormattedMessage id="monitor.address" defaultMessage="发货地" description="发货地" />: </span>
                        {item.consignmentPlace}
                    </p>
                    {
                        item.officialProdUrl ? (
                            <p className="table-item">
                                <span className="table-lable"><FormattedMessage id="complaint.original.graph.link" defaultMessage="原图链接" description="原图链接" />: </span>
                                <a href={item.officialProdUrl} target="_blank">{item.officialProdUrl}</a>
                            </p>
                        ) : ""
                    }
                    {
                        item.officialProdPhoto ? (
                            <p className="table-item" style={{ display: 'flex' }}>
                                <span className="table-lable"><FormattedMessage id="complaint.original.graph" defaultMessage="原图" description="原图" />: </span>
                                <span className="table-lable-img-box">
                                    {
                                        item.officialProdPhoto.split(",").map(img => {
                                            return (
                                                <img className="confirmation-img" key={img} src={img} alt="" onClick={() => this.showModalImg(img ? img.replace('/_', '/') : '', true)} />
                                            )
                                        })
                                    }
                                </span>
                            </p>
                        ) : ""
                    }
                    {
                        item.screenUrl ? (
                            <p className="table-item" style={{ display: 'flex' }}>
                                <span className="table-lable"><FormattedMessage id="complaint.page.screenshots" defaultMessage="页面截图" description="页面截图" />: </span>
                                <span className="table-lable-img-box">
                                    {
                                        item.screenUrl
                                            ? <div onClick={() => this.showModalImg(item.screenUrl, false)}><img className='confirmation-img' src={item.screenUrl} alt='截图' /></div> 
                                            : ''
                                    }
                                </span>
                            </p>
                        ) : ""
                    }
                </div>
            </div>
        )
    }

    // 渲染侵权信息
    renderInfringement(item) {
        let intl = this.props.intl;
        return (
            <div className="table-info">
                <p className="table-item">
                    <span className="table-lable"><FormattedMessage id="complaint.brand" defaultMessage="侵权品牌" description="侵权品牌" />: </span>
                    {item.brandName}
                </p>
                <p className="table-item">
                    <span className="table-lable"><FormattedMessage id="monitor.tort.type" defaultMessage="侵权类型" description="侵权类型" />:</span>
                    {
                        item.reportTypeName === '' ? (
                            <span>
                                {
                                    intl.locale === 'zh' ? item.iprTypeStr : item.iprTypeStrEn
                                }
                            </span>
                        ) : (
                                <span>
                                    {
                                        intl.locale === 'zh' ? item.reportTypeName : item.reportTypeNameEn
                                    }
                                </span>
                            )
                    }
                </p>
                <p className="table-item">
                    <span className="table-lable"><FormattedMessage id="complaint.copyright.number" defaultMessage="著作权号" description="著作权号" />: </span>
                    {item.intellTypeIdName ? item.intellTypeIdName : ''}
                </p>
                <p className="table-item">
                    <span className="table-lable">
                        <FormattedMessage id="monitor.product.classification" defaultMessage="产品分类" description="产品分类" />:
                    </span>
                    <span style={{ width: '50px' }}>
                        {
                            intl.locale === 'en'
                                ? item.prodCategoryNameEn && item.prodCategoryNameEn.length > 15
                                    ? (
                                        <Tooltip title={item.prodCategoryNameEn} >
                                            {
                                                item.prodCategoryNameEn.slice(0, 15) + '...'
                                            }
                                        </Tooltip>
                                    )
                                    : item.prodCategoryNameEn
                                : item.prodCategoryName && item.prodCategoryName.lenght > 10
                                    ? (
                                        <Tooltip title={item.prodCategoryName} >
                                            {
                                                item.prodCategoryName.slice(0, 10) + '...'
                                            }
                                        </Tooltip>
                                    )
                                    : item.prodCategoryName
                        }
                    </span>
                </p>
                <p className="table-item" style={{ display: 'flex' }}>
                    <span className="table-lable"><FormattedMessage id="report.commodity.screenshots" defaultMessage="商品截图" description="商品截图" />: </span>
                    <span className="table-lable-img-box">
                        {
                            item.picUrl ?
                                <img className="confirmation-img" src={item.picUrl} alt="" onClick={() => this.showModalImg(item.picUrl, true)} />
                                :
                                item.prodPhoto.split(",").map(img => {
                                    return (
                                        <img className="confirmation-img" key={img} src={img} alt="" onClick={() => this.showModalImg(img ? img.replace('/_', '/') : '', true)} />
                                    )
                                })
                        }
                    </span>
                </p>
                {/* 盗图类型的才有官方截图 */}
                {
                    item.reportTypeName === '盗图'
                        ?
                        <p className="table-item" style={{ display: 'flex' }}>
                            <span className="table-lable"><FormattedMessage id="complaint.Official.commodity.screenshots" defaultMessage="官方商品截图" description="官方商品截图" />: </span>
                            <span className="table-lable-img-box">
                                {
                                    item.officialProdPhoto.split(",").map(img => {
                                        return (
                                            <img className="confirmation-img" key={img} src={img} alt="" onClick={() => this.showModalImg(img ? img.replace('/_', '/') : '', true)} />
                                        )
                                    })
                                }
                            </span>
                        </p>
                        : ''
                }
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="case.note" defaultMessage="备注" description="备注" />:
                            {
                            item.remark && item.remark.length > 15
                                ? <Tooltip title={item.remark}>{item.remark.slice(0, 15)}...</Tooltip>
                                : item.remark
                        }
                    </span>
                </p>
            </div>
        )
    }

    // 渲染投诉信息
    renderComplaint(item) {
        let { intl } = this.props
        return (
            <div className="table-info">
                <p className="table-item">
                    <span className="table-lable"><FormattedMessage id="complaint.auto.status.isflag" defaultMessage="自动投诉状态" description="自动投诉状态" />: </span>
                    {
                        intl.locale === 'en' ? item.autoFlagNameEn : item.autoFlagName
                    }
                </p>
                {
                    item.autoFlag !== 0 && item.autoFlag !== 1 && item.autoFlag !== -1 ?
                        <p className="table-item">
                            <span className="table-lable"><FormattedMessage id="complaint.please.auto.reasons" defaultMessage="自动投诉失败理由" description="自动投诉失败理由" />: </span>
                            {item.autoMsg}
                        </p> :
                        [
                            <p className="table-item" key="1">
                                <span className="table-lable"><FormattedMessage id="complaint.complaint.number" defaultMessage="投诉单号" description="投诉单号" />: </span>
                                {item.batchId}
                            </p>,
                            <p className="table-item" key="2">
                                <span className="table-lable"><FormattedMessage id="complaint.time" defaultMessage="投诉时间" description="投诉时间" />: </span>
                                {item.gmtComplaintTime}
                            </p>,
                            <p className="table-item" key="3">
                                <span className="table-lable"><FormattedMessage id="complaint.processi.time" defaultMessage="处理时间" description="处理时间" />: </span>
                                {item.gmtModify}
                            </p>,
                            <p className="table-item" key="4">
                                <span className="table-lable"><FormattedMessage id="complaint.complaint.progress" defaultMessage="投诉进度" description="投诉进度" />: </span>
                                {item.statusStr}
                            </p>,
                            <p className="table-item" key="5">
                                <span className="table-lable"><FormattedMessage id="complaint.complaint.reason" defaultMessage="投诉理由" description="投诉理由" />: </span>
                                {
                                    item.reasonName && item.reasonName.length > 10
                                        ? (
                                            <Tooltip title={item.reasonName}>
                                                {item.reasonName.slice(0, 10) + '...'}
                                            </Tooltip>
                                        )
                                        : item.reason
                                }
                            </p>
                        ]
                }
            </div>
        )
    }


    // 创建table配置
    createColumns() {
        const columns = [{
            title: <FormattedMessage id="monitor.source" defaultMessage="来源" description="来源" />,
            width: '15%',
            key: 'dataFrom',
            render: (text, item) => this.renderSource(item)
        }, {
            title: <FormattedMessage id="monitor.commodity.information" defaultMessage="商品信息" description="商品信息" />,
            width: '17%',
            render: (text, item) => this.renderShops(item)
        }, {
            title: <FormattedMessage id="monitor.tort.information" defaultMessage="侵权信息" description="侵权信息" />,
            width: '16%',
            render: (text, item) => this.renderInfringement(item)
        }, {
            title: <FormattedMessage id="complaint.complaint.information" defaultMessage="投诉信息" description="投诉信息" />,
            width: '16%',
            render: (text, item) => this.renderComplaint(item)
        }];
        return columns;
    }

    render() {
        let {
            intl, total, onlineList, brandList, complaintStatusList,
            complaintSourceList, isFetch, userInfo, permissionList, onlineComplaintPlatformList,
            autoComplaintStatus, exportExcelTitle, prodList
        } = this.props;
        let {
            showModalVisible, showModalImg, platformId, brandId, dataFrom,
            statusStrNumber, nameOrmobile, monitorName, gmtComplaintTimeSDate, gmtComplaintTimeEDate,
            autoFlag, gmtMonitorSDate, gmtMonitorEDate, queryUrl, visibleExcelExport,
            autoTitleParam, tbName, prodTypeId, smaill, filterSendTimeStartDate, filterSendTimeEndDate, remarkLike
        } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.complaint.management', title: '投诉管理' },
            { link: '', titleId: 'router.online.complaint.management', title: '线上投诉管理' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData} className="online-wrapper">
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "global.platform", defaultMessage: "平台", description: "平台" })}>
                                <Select
                                    value={platformId}
                                    showSearch
                                    placeholder={intl.formatMessage({ id: "complaint.choose.platform", defaultMessage: "请选择平台", description: "请选择平台" })}
                                    dropdownMatchSelectWidth={true}
                                    onChange={(value) => this.handleSelectChange(value, 'platformId')}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=''><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        onlineComplaintPlatformList && onlineComplaintPlatformList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                                {
                                                    intl.locale === 'en'
                                                        ? opt.dictLabelEn
                                                        : opt.dictLabel
                                                }
                                            </Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "complaint.brand", defaultMessage: "侵权品牌", description: "侵权品牌" })}>
                                <Select
                                    value={brandId}
                                    showSearch
                                    placeholder={intl.formatMessage({ id: "complaint.choose.brand", defaultMessage: "请选择侵权品牌", description: "请选择侵权品牌" })}
                                    dropdownMatchSelectWidth={true}
                                    onChange={(value) => this.handleSelectChange(value, 'brandId')}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=''><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        brandList && brandList.filter(item => item.isDelete === 0)
                                            .map(opt => <Option value={opt.id} key={opt.id}>{opt.name}</Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "global.status", defaultMessage: "状态", description: "状态" })}>
                                <Select
                                    value={statusStrNumber}
                                    showSearch
                                    placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                    dropdownMatchSelectWidth={true}
                                    onChange={(value) => this.handleSelectChange(value, 'statusStrNumber')}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=''><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        complaintStatusList && complaintStatusList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                                {
                                                    intl.locale === 'en'
                                                        ? opt.dictLabelEn
                                                        : opt.dictLabel
                                                }
                                            </Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "monitor.source", defaultMessage: "来源", description: "来源" })}>
                                <Select
                                    value={dataFrom}
                                    showSearch
                                    placeholder={intl.formatMessage({ id: "complaint.please.choose.source", defaultMessage: "请选择来源", description: "请选择来源" })}
                                    dropdownMatchSelectWidth={true}
                                    onChange={(value) => this.handleSelectChange(value, 'dataFrom')}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=''><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        complaintSourceList && complaintSourceList.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                                {
                                                    intl.locale === 'en'
                                                        ? opt.dictLabelEn
                                                        : opt.dictLabel
                                                }
                                            </Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "report.reporter", defaultMessage: "举报人", description: "举报人" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "complaint.please.choose.reporter", defaultMessage: "请输入举报人", description: "请输入举报人" })} value={nameOrmobile} onChange={e => this.setState({ nameOrmobile: e.target.value.trim() })} />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "complaint.monitoring.rules", defaultMessage: "监控规则", description: "监控规则" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "complaint.please.enter.monitoring.rules", defaultMessage: "请输入监控规则", description: "请输入监控规则" })} value={monitorName} onChange={e => this.setState({ monitorName: e.target.value.trim() })} />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "complaint.complaint.start.time", defaultMessage: "投诉起始", description: "投诉起始" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'S', 'gmtComplaintTime')} value={gmtComplaintTimeSDate} />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "complaint.complaint.end.time", defaultMessage: "投诉截止", description: "投诉截止" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'E', 'gmtComplaintTime')} value={gmtComplaintTimeEDate} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "complaint.report.start.time", defaultMessage: "举报起始", description: "举报起始" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'S', 'gmtMonitor')} value={gmtMonitorSDate} />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "complaint.report.end.time", defaultMessage: "举报截止", description: "举报截止" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'E', 'gmtMonitor')} value={gmtMonitorEDate} />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "complaint.goods.link", defaultMessage: "商品链接", description: "商品链接" })}>
                                <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "complaint.please.enter.goods.link", defaultMessage: "请输入商品链接", description: "请输入商品链接" })} value={queryUrl} onChange={e => this.setState({ queryUrl: e.target.value.trim() })} />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "complaint.auto.status.isflag", defaultMessage: "自动投诉状态", description: "自动投诉状态" })}>
                                <Select
                                    value={autoFlag}
                                    showSearch
                                    placeholder={intl.formatMessage({ id: "complaint.please.auto.status", defaultMessage: "请选择自动投诉状态", description: "请选择自动投诉状态" })}
                                    dropdownMatchSelectWidth={true}
                                    onChange={(value) => this.handleSelectChange(value, 'autoFlag')}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=''><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        autoComplaintStatus && autoComplaintStatus.filter(item => item.isDel === 0)
                                            .map(opt => <Option key={opt.dictVal} value={opt.dictVal}>
                                                {
                                                    intl.locale === 'en'
                                                        ? opt.dictLabelEn
                                                        : opt.dictLabel
                                                }
                                            </Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "report.category", defaultMessage: "商品类别", description: "商品类别" })}>
                                <Select
                                    showSearch
                                    value={prodTypeId}
                                    dropdownMatchSelectWidth={false}
                                    onChange={(e) => this.handleSelectChange(e, 'prodTypeId')}
                                    placeholder={intl.formatMessage({ id: "report.please.select.torts.goods.category", defaultMessage: "请选择商品类别", description: "请选择商品类别" })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Select.Option value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </Select.Option>
                                    {
                                        prodList && prodList.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.id} value={opt.id}>{intl.locale === 'zh' ? opt.name : opt.nameEn}</Select.Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "report.push.time", defaultMessage: "推送时间", description: "推送时间" })}>
                                <DatePicker
                                    value={filterSendTimeStartDate}
                                    style={{ width: 'auto' }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    showTime={{ format: 'HH:mm:ss' }}
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, '', 'filterSendTimeStart')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "report.times.to", defaultMessage: "推送时间", description: "推送时间" })}>
                                <DatePicker
                                    value={filterSendTimeEndDate}
                                    style={{ width: 'auto' }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    showTime={{ format: 'HH:mm:ss' }}
                                    onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, '', 'filterSendTimeEnd')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={intl.formatMessage({ id: "case.note", defaultMessage: "备注", description: "备注" })}
                            >
                                <Input
                                    value={remarkLike}
                                    onPressEnter={(e) => this.handleSearch()}
                                    onChange={e => this.setState({ remarkLike: e.target.value.trim() })}
                                    placeholder={intl.formatMessage({ id: "report.please.enter.note", defaultMessage: "请输入备注", description: "请输入备注" })}
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

                <Row className="operation-btns">
                    <Col span={24}>
                        {
                            getButtonPrem(permissionList, '006001002') ?
                                <Upload
                                    action={Req.uploadFile}
                                    withCredentials={true}
                                    showUploadList={false}
                                    onChange={(file) => this.importExcel(file)}
                                >
                                    <Button className="first upload-inport-style"><FormattedMessage id="global.import" defaultMessage="导入" description="导入" /></Button>
                                </Upload> : ''
                        }
                        {
                            getButtonPrem(permissionList, '006001003')
                                ? <Button onClick={() => this.showExportExcelModal()}>
                                    <FormattedMessage id="global.export" defaultMessage="导出" description="导出" />
                                </Button>
                                : ''
                        }
                        {
                            getButtonPrem(permissionList, '006001002') ?
                                <a style={{ marginLeft: '15px', color: '#668fff' }} download="投诉管理导入模板" href={Req.downloadExcelTemplate + `?num=2`}><FormattedMessage id="global.download.import.template" defaultMessage="下载导入模板" description="下载导入模板" /></a>
                                : ''
                        }
                    </Col>
                </Row>

                <Alert message={intl.formatMessage({ id: "global.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据`, description: `界面共（100）条数据` }, { count: total })} type="info" showIcon className="Alert_info" />
                <Table dataSource={onlineList} columns={this.createColumns()} pagination={this.createPaginationOption()} rowKey="id" loading={isFetch} />
                <PictureModal
                    visible={showModalVisible}
                    onCancel={() => this.handleCancelImg()}
                    showImg={showModalImg}
                    pictureModalwidth={ smaill ? undefined : '80%'}
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
