//运营筛选界面
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, DatePicker, Form, Row, Col, Button, message, Select, Input, Alert, Pagination, Tooltip, Upload, Checkbox, Modal, Tabs } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import PictureModal from '../../common/layout/modal/pictureModal'
import { formatDateToMs, getButtonPrem, getName, getFormatDate } from '../../../utils/util'
import ExcelExportModal from '../../common/layout/modal/exportExcelModal'
import Req from '../../../api/req'
import moment from 'moment'
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
class OperationScreening extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportType: undefined,  // 查询举报类型
            auditStatus: undefined,  // 查询审核状态
            tabStatus: '',
            platformType: undefined,  // 查询举报平台
            brandId: undefined,  // 查询举报的品牌
            reportReasonId: undefined,
            trademarkId: undefined,
            prodTypeId: undefined,
            reportSourceType: undefined,
            userNameLikeOrMobile: '',  // 查询举报人用户名
            startTime: '',  // 查询开始时间
            startTimeMs: 0,
            startDate: null,
            endTime: '',  // 查询结束时间
            endTimeMs: 0,
            endDate: null,
            filterSendTimeEnd: '',//推送时间
            filterSendTimeEndDate: null,
            filterSendTimeEndMs: 0,
            filterSendTimeStart: '',
            filterSendTimeStartDate: null,
            filterSendTimeStartMs: 0,
            remarkLikeRight: '',//备注
            queryUrl: '',
            shopPageSize: 10,  // 查询分页大小
            storePageSize: 10,  // 查询分页大小
            visibleImg: false,
            showImg: '',  // 当前显示的图片
            storeName: '',
            searchData: { // 搜索数据                
                brandId: '',
                reportType: '',
                platformType: '',
                auditStatus: '',
                gmtCreateStart: '',
                gmtCreateEnd: '',
                userNameLikeOrMobile: '',
                queryUrl: '',
                reportReasonId: '',
                trademarkId: '',
                prodTypeId: '',
                reportSourceType: '',
                storeName: '',
                remarkLikeRight: '',
                filterSendTimeStart:'',
                filterSendTimeEnd: ''
            },
            checkStatusType: 7,//已推送
            selectedRowKeys: [],
            picIdList: [], //盗图，
            tradeIdList: [],//商标
            excludePicIdList: [],  // 选择全部数据的过滤ID
            excludeTradeIdList: [],  // 选择全部数据的过滤ID
            allData: '',  // 是否选中全部
            auditStatusAfter: '',  // 审核状态
            chooseCount: 0,   // 选中待审核数量
            total: 0,
            indeterminate: false, // 全选框样式控制
            itemAudit: '',     // 单条审核
            visibleExcelExport: false,  // 自定义导出数据的弹窗控制
            autoTitleParam: [],  //  自定义数据
            autoPageNum: 100,  // 自定义数据量
            tbName: '运营筛选-' + getFormatDate('yyyy-MM-dd-hh:mm'),
            tabActiveKey: 'shop',
        }
    }

    componentWillMount() {
        // 不带参数跳转
        let endTime = getFormatDate('yyyy-MM-dd hh:mm:ss');
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let startTime = '';
        if ((month === 5 || month === 7 || month === 10 || month === 12) && day === 31) {
            day = 30
        } else if (month === 3 && year % 4 === 0 && day > 29) {
            day = 29
        } else if (month === 3 && year % 4 !== 0 && day > 28) {
            day = 28
        }
        if (month === 1) {
            year = year - 1;
            month = 12;
        } else {
            month = month - 1;
        }
        //startTime = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0'+ minutes : minutes}:${seconds < 10 ? '0'+seconds: seconds}`
        startTime = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} 00:00:00`
        let searchData = this.state.searchData;
        searchData.gmtCreateStart = startTime;
        searchData.gmtCreateEnd = endTime;
        this.setState({
            startTime: startTime,
            startDate: moment(startTime, "YYYY-MM-DD HH:mm:ss"),
            startTimeMs: formatDateToMs(startTime),
            endTime: endTime,
            endDate: moment(endTime, "YYYY-MM-DD HH:mm:ss"),
            endTimeMs: formatDateToMs(endTime),
            searchData
        }, () => {
            let { tabActiveKey } = this.state;
            if (tabActiveKey === 'shop') {
                this.getConfirmationList([], 1)
            } else {
                this.getFilterStorePage([], 1)
            }
            this.getReportReasonQueryList()
            this.getTrademarkQueryList()
        })
        if (this.props.getExportExcelTitle) {
            this.props.getExportExcelTitle({ excelType: 11 })
        }
    }

    componentWillReceiveProps(nextProps) {
        let { selectedRowKeys, allData, excludePicIdList, excludeTradeIdList } = this.state;
        if (nextProps.volunteerScreen !== this.props.volunteerScreen && allData === 'all') {
            for (let i = 0; i < nextProps.volunteerScreen.length; i++) {
                const element = nextProps.volunteerScreen[i];
                if (selectedRowKeys.indexOf(element.id) === -1 && element.auditStatus === 6 && excludePicIdList.indexOf(element.id) === -1 && excludeTradeIdList.indexOf(element.id) === -1) {
                    selectedRowKeys.push(element.id)
                }
            }
            this.setState({
                selectedRowKeys
            })
        }
    }

    //判断搜索条件是否与页面显示添加一直
    getCondition() {
        let { auditStatus, platformType, storeName, userNameLikeOrMobile, reportType, brandId,
            queryUrl, reportSourceType, prodTypeId, reportReasonId, startTime, endTime,
            trademarkId, remarkLikeRight, filterSendTimeEnd, filterSendTimeStart, searchData } = this.state;
        if(
            (auditStatus !== undefined && auditStatus !== searchData.auditStatus) 
            || (platformType !== undefined && platformType !== searchData.platformType) 
            || (reportType !== undefined && reportType !== searchData.reportType)
            || (brandId !== undefined && brandId !== searchData.brandId)
            || (reportSourceType !== undefined && reportSourceType !== searchData.reportSourceType)
            || (prodTypeId !== undefined && prodTypeId !== searchData.prodTypeId)
            || (reportReasonId !== undefined && reportReasonId !== searchData.reportReasonId)
            || (trademarkId !== undefined && trademarkId !== searchData.trademarkId)
            || userNameLikeOrMobile !== searchData.userNameLikeOrMobile 
            || startTime !== searchData.gmtCreateStart 
            || endTime !== searchData.gmtCreateEnd 
            || storeName !== searchData.storeName 
            || remarkLikeRight !== searchData.remarkLikeRight 
            || filterSendTimeStart !== searchData.filterSendTimeStart 
            || filterSendTimeEnd !== searchData.filterSendTimeEnd 
            || queryUrl !== searchData.queryUrl
            ) {
                message.info('当前条件与查询条件不一致，请搜索后操作');
                return false
        }else {
            return true
        }
    }

    // 全选按钮操作
    selectAll(e) {
        /**
         * 首先判断全选框的选中状态
         * 如果是选中状态则将选中的元素都添加到选中数组
         * 否则将所有的数据置空
         */
        let checked = e.target.checked,
        allData = '',
        total = 0,
        selectedRowKeys = [],
        chooseCount = 0;
        if (checked) {
            allData = 'all';
            if (selectedRowKeys.indexOf('all') === -1) {
                selectedRowKeys.push('all')
            }
            let { searchData } = this.state;
            let data = Object.assign({}, searchData);
            let { volunteerScreen, getConfirmCount } = this.props;
            if (getConfirmCount) {
                getConfirmCount(data, (res) => {
                    this.setState({
                        chooseCount: res.dataObject,
                        total: res.dataObject
                    })
                })
            }
            for (let i = 0; i < volunteerScreen.length; i++) {
                const element = volunteerScreen[i];
                if (selectedRowKeys.indexOf(element.id) === -1 && element.auditStatus === 6) {
                    selectedRowKeys.push(element.id);
                }
            }
        } else {
            if (selectedRowKeys.indexOf('all') !== -1) {
                selectedRowKeys.splice(selectedRowKeys.indexOf('all'), 1)
            }
            chooseCount = 0;
        }
        this.setState({
            selectedRowKeys,
            chooseCount,
            excludePicIdList: [],
            excludeTradeIdList: [],
            picIdList: [],
            tradeIdList: [],
            allData,
            total,
            indeterminate: false
        })
    }

    // 获取查询参数--举报理由
    getReportReasonQueryList(brandId, reportReasonId) {
        // let { brandId, reportReasonId } = this.state;
        let data = {
            brandId: brandId === undefined ? '' : brandId,
            vrLabelLike: reportReasonId === undefined ? '' : reportReasonId
        };
        if (this.props.getReportReasonQueryList) {
            this.props.getReportReasonQueryList(data)
        }
    }

    // 获取查询参数--商标
    getTrademarkQueryList(brandId, trademarkId) {
        // let { brandId, trademarkId } = this.state;
        let data = {
            brandId: brandId === undefined ? '' : brandId,
            vrLabelLike: trademarkId === undefined ? '' : trademarkId
        };
        if (this.props.getReportReasonQueryList) {
            this.props.getTrademarkQueryList(data)
        }
    }

    // 品牌筛选变化时
    handleChangeBrand(value) {
        this.setState({
            brandId: value
        }, () => {
            this.getReportReasonQueryList(value);
            this.getTrademarkQueryList(value)
        })
    }

    // 模糊搜索举报理由
    handleSearchReportReason(val) {
        let { brandId } = this.state;
        this.getReportReasonQueryList(brandId, val)
    }

    // 模糊搜索商标
    handleSearchTrademark(val) {
        let { brandId } = this.state;
        this.getTrademarkQueryList(brandId, val)
    }

    // 选择单项
    selectItem(e, record) {
        /**
         * 首选判断是否是全选状态下
         * 其次判断当前是否选中状态
         * 再次判断当前选择的数据类型
         * 然后根据当前选择的数据类型做对应的增删操作
         */
        let checked = e.target.checked, { allData, selectedRowKeys, excludePicIdList, excludeTradeIdList, picIdList, tradeIdList, chooseCount, indeterminate, total } = this.state;
        if (allData === 'all') {
            if (checked) {
                chooseCount += 1;
                if (record.reportType === 1) {
                    excludePicIdList.splice(excludePicIdList.indexOf(record.id), 1)
                } else {
                    excludeTradeIdList.splice(excludeTradeIdList.indexOf(record.id), 1)
                }
                if (selectedRowKeys.indexOf(record.id) === -1) {
                    selectedRowKeys.push(record.id)
                }
            } else {
                chooseCount -= 1;
                if (record.reportType === 1) {
                    if (excludePicIdList.indexOf(record.id) === -1) {
                        excludePicIdList.push(record.id)
                    }
                } else {
                    if (excludeTradeIdList.indexOf(record.id) === -1) {
                        excludeTradeIdList.push(record.id)
                    }
                }
                selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
            }
        } else {
            allData = 'item'
            if (checked) {
                chooseCount += 1;
                if (record.reportType === 1) {
                    if (picIdList.indexOf(record.id) === -1) {
                        picIdList.push(record.id)
                    }
                } else {
                    if (tradeIdList.indexOf(record.id) === -1) {
                        tradeIdList.push(record.id)
                    }
                }
                if (selectedRowKeys.indexOf(record.id) === -1) {
                    selectedRowKeys.push(record.id)
                }
                excludePicIdList.splice(excludePicIdList.indexOf(record.id), 1)
                excludeTradeIdList.splice(excludeTradeIdList.indexOf(record.id), 1)
            } else {
                chooseCount -= 1;
                picIdList.splice(picIdList.indexOf(record.id), 1)
                tradeIdList.splice(tradeIdList.indexOf(record.id), 1)
                selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
            }
        }
        if (total === chooseCount && total !== 0) {
            if (selectedRowKeys.indexOf('all') === -1) {
                selectedRowKeys.push('all')
            }
            indeterminate = false;
        } else if (chooseCount !== 0) {
            if (selectedRowKeys.indexOf('all') !== -1) {
                selectedRowKeys.splice(selectedRowKeys.indexOf('all'), 1)
            }
            indeterminate = true;
        } else if (chooseCount === 0) {
            if (selectedRowKeys.indexOf('all') !== -1) {
                selectedRowKeys.splice(selectedRowKeys.indexOf('all'), 1)
            }
            indeterminate = false;
        }
        this.setState({
            picIdList,
            tradeIdList,
            excludePicIdList,
            excludeTradeIdList,
            selectedRowKeys,
            allData,
            chooseCount,
            indeterminate
        })
    }

    // 获取品牌确认列表
    getConfirmationList(oldVolunteerScreen, pageNo) {
        let { getConfirmationList } = this.props;
        let data = this.queryData(pageNo);
        let { isFetch } = this.props;
        if (!isFetch) {
            getConfirmationList(data, oldVolunteerScreen)
        }
    }
    //获取店铺列表
    getFilterStorePage(oldVolunteerScreenStoreList, pageNo) {
        let data = this.queryData(pageNo);
        let { isFetch, getFilterStorePage } = this.props;
        if (!isFetch) {
            getFilterStorePage(oldVolunteerScreenStoreList, data)
        }
    }
    // 查询参数
    queryData(pageNo) {
        let { searchData, shopPageSize, storePageSize, tabActiveKey } = this.state;
        let pageSize = 10;
        if (tabActiveKey === 'shop') {
            pageSize = shopPageSize;
        } else {
            pageSize = storePageSize;
        }
        // 请求后台
        let data = Object.assign({}, searchData)
        if (searchData.queryUrl) {
            data.queryUrl = encodeURIComponent(searchData.queryUrl);
        }
        data.pageNo = pageNo;
        data.pageSize = pageSize;
        return data;
    }
    // 选择器选择
    handleSelectChange(value, key) {
        this.setState({
            [key]: value
        })
    }

    // 搜索
    handleSearch() {
        let { searchData, brandId, reportType, platformType, startTime,
            endTime, userNameLikeOrMobile, auditStatus, queryUrl, prodTypeId,
            reportReasonId, trademarkId, reportSourceType, storeName, remarkLikeRight,
            filterSendTimeStart, filterSendTimeEnd
        } = this.state
        searchData = {
            brandId: brandId === undefined ? '' : brandId,
            reportType: reportType === undefined ? '' : reportType,
            platformType: platformType === undefined ? '' : platformType,
            auditStatus: auditStatus !== undefined ? auditStatus : '',
            prodTypeId: prodTypeId !== undefined ? prodTypeId : '',
            reportReasonId: reportReasonId !== undefined ? reportReasonId : '',
            trademarkId: trademarkId !== undefined ? trademarkId : '',
            reportSourceType: reportSourceType !== undefined ? reportSourceType : '',
            gmtCreateStart: startTime,
            gmtCreateEnd: endTime,
            userNameLikeOrMobile,
            queryUrl,
            storeName: storeName ? storeName : '',
            remarkLikeRight: remarkLikeRight ? remarkLikeRight : '',
            filterSendTimeStart,
            filterSendTimeEnd
        }
        this.setState({
            searchData,
            tabStatus: auditStatus ? auditStatus.toString() : '',
            selectedRowKeys: [],
            allData: '',
            picIdList: [],
            tradeIdList: [],
            chooseCount: 0,
            excludePicIdList: [],
            excludeTradeIdList: [],
            indeterminate: false,
        }, () => {
            this.getConfirmationList([], 1)
            this.getFilterStorePage([], 1)
        })
    }

    // 重置
    handleReset() {
        let searchData = {
            brandId: '',
            reportType: '',
            platformType: '',
            auditStatus: '',
            gmtCreateStart: '',
            gmtCreateEnd: '',
            userNameLikeOrMobile: '',
            queryUrl: '',
            prodTypeId: '',
            reportReasonId: '',
            trademarkId: '',
            reportSourceType: '',
            storeName: '',
            remarkLikeRight: '',
            filterSendTimeStart: '',
            filterSendTimeEnd: ''
        }
        this.setState({
            reportType: undefined,
            auditStatus: undefined,
            platformType: undefined,
            brandId: undefined,
            prodTypeId: undefined,
            reportReasonId: undefined,
            trademarkId: undefined,
            reportSourceType: undefined,
            startTime: '',
            startTimeMs: 0,
            startDate: null,
            endTime: '',
            endTimeMs: 0,
            endDate: null,
            userNameLikeOrMobile: '',
            queryUrl: '',
            storeName: '',
            searchData,
            tabStatus: '',
            selectedRowKeys: [],
            allData: '',
            picIdList: [],
            tradeIdList: [],
            chooseCount: 0,
            excludePicIdList: [],
            excludeTradeIdList: [],
            indeterminate: false,
            filterSendTimeStart: '',//推送时间
            filterSendTimeStartDate: null,
            filterSendTimeStartMs: 0,
            filterSendTimeEnd: '',
            filterSendTimeEndDate: null,
            filterSendTimeEndMs: 0,
            remarkLikeRight: '',
        }, () => {
            this.getConfirmationList([], 1)
            this.getFilterStorePage([], 1)
            this.getReportReasonQueryList()
            this.getTrademarkQueryList()
        })
    }

    // 上传文件前检测文件大小
    beforeUpload(file) {
        if ((file.size / 1024 / 1024) >= 10) {
            message.info('上传文件过大');
            this.uid = file.uid;
            return false;
        }
    }

    // 选择日期
    changeDatePicker(date, dateStr, type) {
        let { startTimeMs, endTimeMs, filterSendTimeStartMs, filterSendTimeEndMs } = this.state;
        let startMs = 0, endMs = 0;
        if (type === 'startTime') {
            startMs = formatDateToMs(dateStr);
            endMs = endTimeMs;
        } else if (type === 'endTime') {
            startMs = startTimeMs;
            endMs = formatDateToMs(dateStr);
        } else if (type === 'filterSendTimeStart') {
            startMs = formatDateToMs(dateStr);
            endMs = filterSendTimeEndMs;
        } else if (type === 'filterSendTimeEnd') {
            startMs = filterSendTimeStartMs;
            endMs = formatDateToMs(dateStr);
        }
        if (endMs && (endMs - startMs < 0)) {
            let { intl } = this.props;
            message.warning(intl.formatMessage({ id: 'monitor.please.select.a.valid.time.range' }));
            return
        }
        if (type === 'startTime') {
            this.setState({
                startTimeMs: startMs,
                startTime: dateStr,
                startDate: date
            })
        } else if (type === 'endTime') {
            this.setState({
                endTimeMs: endMs,
                endTime: dateStr,
                endDate: date
            })
        } else if (type === 'filterSendTimeStart') {
            this.setState({
                filterSendTimeStartMs: startMs,
                filterSendTimeStart: dateStr,
                filterSendTimeStartDate: date
            })
        } else if (type === 'filterSendTimeEnd') {
            this.setState({
                filterSendTimeEndMs: endMs,
                filterSendTimeEnd: dateStr,
                filterSendTimeEndDate: date
            })
        }
    }


    //显示大图
    comfirmationModalImg(img) {
        this.setState({
            visibleImg: true,
            showImg: img
        })
    }

    //批量推送
    allCheck() {
        if(this.getCondition()){
            let { intl } = this.props
            let { chooseCount } = this.state
            if (chooseCount > 0) {
                confirm({
                    title: intl.formatMessage({ id: "report.batch.screening", defaultMessage: "运营推送", description: "运营推送" }),
                    content: intl.formatMessage({ id: 'report.batch.push.allinfo', defaultMessage: '你确定推送这些信息么?', description: '你确定推送这些信息么?' }),
                    onOk: () => this.onOkCheckModal(),
                    onCancel: () => { }
                })
            } else {
                message.info(intl.formatMessage({ id: 'report.please.excuse.push', defaultMessage: '请选择待推送信息', description: '请选择待推送信息' }))
            }
        }
    }

    //审核
    signalCheck(record) {
        let { intl } = this.props;
        let itemAudit = {
            id: record.id,
            reportType: record.reportType
        }
        this.setState({
            checkStatusModal: true,
            checkStatusType: 7,
            itemAudit
        }, () => {
            confirm({
                title: intl.formatMessage({ id: "report.batch.screening", defaultMessage: "运营推送", description: "运营推送" }),
                content: intl.formatMessage({ id: 'report.batch.push.info', defaultMessage: '你确定推送这条信息么?', description: '你确定推送这条信息么?' }),
                onOk: () => this.onOkCheckModal(),
                onCancel: () => { }
            })
        })
    }

    //审核确定modal
    onOkCheckModal() {
        let { confirmExamin, volunteerScreen, reportOperationScreen, pageNo } = this.props
        let { itemAudit, picIdList, tradeIdList, checkStatusType, allData, excludePicIdList, excludeTradeIdList, searchData, selectedRowKeys, chooseCount, } = this.state
        let data = {
            auditStatusAfter: checkStatusType,
            SendTime: getFormatDate('yyyy-MM-dd hh:mm:ss')
        }
        let auditStatus = getName(reportOperationScreen, checkStatusType, 'suitStatus');
        data.auditStatusName = auditStatus.dictLabel;
        data.auditStatusNameEn = auditStatus.dictLabelEn;
        data = Object.assign(data, searchData)
        //单条审核
        if (itemAudit.id) {
            data.itemAudit = itemAudit;
            if (itemAudit.reportType === 1) {
                data.picIdList = [itemAudit.id]
            } else {
                data.tradeIdList = [itemAudit.id]
            }
            data.chooseCount = 1;
            data.auditCount = 1;
            confirmExamin(data, volunteerScreen, () => {
                this.setState({
                    itemAudit: '',
                    indeterminate: false,
                    total: 0,
                    chooseCount: 0
                })
            })
        } else {
            //批量审核
            data.selectedRowKeys = selectedRowKeys;
            data.chooseCount = chooseCount;
            data.auditCount = chooseCount
            if (allData === 'all') {
                data.excludePicIdList = excludePicIdList.toString();
                data.excludeTradeIdList = excludeTradeIdList.toString();
            } else {
                data.picIdList = picIdList.toString();
                data.tradeIdList = tradeIdList.toString();
            }
            confirmExamin(data, volunteerScreen, (reload) => {
                this.setState({
                    selectedRowKeys: [],
                    excludePicIdList: [],
                    excludeTradeIdList: [],
                    picIdList: [],
                    tradeIdList: [],
                    chooseCount: 0,
                    total: 0,
                    allData: '',
                    indeterminate: false,
                })
                if (reload) {
                    this.getConfirmationList([], pageNo)
                }
            })
        }
    }

    // 导入
    importExcel({ file }) {
        if (file.status === 'done' && file.response.success) {
            let data = {
                type: 0,
                excelType: 10,
                excelUrl: file.response.dataObject,
                excelName: file.name
            };
            this.props.saveExcelData(data)
            this.getConfirmationList([], 1)
        } else if (file.status === 'done' && !file.response.success) {
            message.info(file.response.msg)
        } else if (file.status === 'error') {
            message.info('导入失败，请稍后再试。')
        }
    }

    // 显示自定义导出弹窗
    showExportExcelModal() {
        if(this.getCondition()){
            let result = localStorage.getItem('excelImport');
            let { exportExcelTitle } = this.props;
            if (result) {
                result = JSON.parse(result);
                if (!result.operateScreen) {
                    let autoTitleParam = [];
                    for (let i = 0; i < exportExcelTitle.length; i++) {
                        const element = exportExcelTitle[i];
                        if (element.excelType === 11) {
                            autoTitleParam.push(element.num)
                        }
                    }
                    this.setState({
                        autoTitleParam,
                        visibleExcelExport: true
                    })
                } else {
                    this.setState({
                        autoTitleParam: result.operateScreen,
                        visibleExcelExport: true
                    })
                }
            } else if (!result) {
                let autoTitleParam = [];
                for (let i = 0; i < exportExcelTitle.length; i++) {
                    const element = exportExcelTitle[i];
                    if (element.excelType === 11) {
                        autoTitleParam.push(element.num)
                    }
                }
                this.setState({
                    autoTitleParam,
                    visibleExcelExport: true
                })
            }
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
        result.operateScreen = data.autoTitleParam;
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
        let { brandList, platfromList, reportType, reportOperationScreen, prodList, reportReasonQueryList, tardemarkQueryList, reportResourceType } = this.props;
        let { saveExportData } = this.props;
        let queryParamStr = [];
        if (searchData.brandId) {
            let currentBrand = getName(brandList, searchData.brandId, 'brand');
            queryParamStr.push(`所属品牌:${currentBrand.name}`)
        }
        if (searchData.platformType) {
            let currentPlatform = getName(platfromList, searchData.platformType);
            queryParamStr.push(`平台:${currentPlatform.dictLabel}`)
        }
        if (searchData.reportType) {
            let currentReportType = getName(reportType, searchData.reportType);
            queryParamStr.push(`举报类型:${currentReportType.dictLabel}`)
        }
        if (searchData.auditStatus) {
            let currentAuditStatus = getName(reportOperationScreen, searchData.auditStatus);
            queryParamStr.push(`举报状态:${currentAuditStatus.dictLabel}`)
        }
        if (searchData.reportReasonId) {
            let reportReason = getName(reportReasonQueryList, searchData.reportReasonId, 'reportReason');
            queryParamStr.push(`举报理由:${reportReason.vrLabel}`)
        }
        if (searchData.trademarkId) {
            let trademark = getName(tardemarkQueryList, searchData.trademarkId, 'trademark');
            queryParamStr.push(`商标:${trademark.vrLabel}`)
        }
        if (searchData.prodTypeId) {
            let prodType = getName(prodList, searchData.prodTypeId, 'prod');
            queryParamStr.push(`商品类别:${prodType.name}`)
        }
        if (searchData.reportSourceType) {
            let reportSourceType = getName(reportResourceType, searchData.reportSourceType);
            queryParamStr.push(`举报来源:${reportSourceType.dictLabel}`)
        }
        if (searchData.userNameLikeOrMobile) {
            queryParamStr.push(`举报人:${searchData.userNameLikeOrMobile}`)
        }
        if (searchData.gmtCreateStart) {
            queryParamStr.push(`举报开始时间:${searchData.gmtCreateStart}`)
        }
        if (searchData.gmtCreateEnd) {
            queryParamStr.push(`举报截止时间:${searchData.gmtCreateEnd}`)
        }
        if (searchData.queryUrl) {
            queryParamStr.push(`商品链接:${searchData.queryUrl}`)
        }
        if (searchData.storeName) {
            queryParamStr.push(`店铺名称:${searchData.storeName}`)
        }
        if (searchData.filterSendTimeStart) {
            queryParamStr.push(`推送开始时间:${searchData.filterSendTimeStart}`)
        }
        if (searchData.filterSendTimeEnd) {
            queryParamStr.push(`推送截止时间:${searchData.filterSendTimeEnd}`)
        }
        if (searchData.remarkLikeRight) {
            queryParamStr.push(`备注:${searchData.remarkLikeRight}`)
        }
        let result = Object.assign({}, searchData);
        result.queryUrl = encodeURIComponent(searchData.queryUrl);
        if (result.gmtCreateStart) {
            result.gmtCreateStart = result.gmtCreateStart
            delete result.gmtCreateStart
        }
        if (result.gmtCreateEnd) {
            result.gmtCreateEnd = result.gmtCreateEnd
            delete result.gmtCreateEnd
        }
        // let data = {
        //     type: 1,
        //     excelType: 11,
        //     queryParam: JSON.stringify(result),
        //     queryParamStr: queryParamStr.toString(),
        //     autoTitleParam: autoTitleParam.toString(),
        //     autoPageNum,
        //     tbName
        // }
        
        let exportData = {
            //queryParam: JSON.stringify(result),
			queryParamStr: queryParamStr.toString(),
			autoTitleParam: autoTitleParam.toString(),
			autoPageNum,
			excelName: tbName
        }
        exportData = Object.assign(exportData,searchData)
        saveExportData(exportData)
    }


    //渲染信息
    renderReportInfo(data, item) {
        let { intl } = this.props
        if (data === 1) {
            return (
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="report.category" defaultMessage="商品类目" description="商品类目" />:
                            {
                            intl.locale === 'zh'
                                ? <Tooltip title={item.prodTypeName}>{item.prodTypeName.slice(0, 15)}...</Tooltip>
                                : <Tooltip title={item.prodTypeNameEn}>{item.prodTypeNameEn.slice(0, 15)}...</Tooltip>
                        }
                    </span>
                </p>
            )
        } else if (data === 2) {
            return (
                <div>
                    <p className="table-item" key="pos1">
                        <span className="table-item-span table-item-w100">
                            <FormattedMessage id="report.position.of.trademark" defaultMessage="商标出现位置" description="商标出现位置" />: {item.siteToAppearName}
                        </span>
                    </p>
                    <p className="table-item" key="pos2">
                        <span className="table-item-span table-item-w100">
                            <FormattedMessage id="report.report.reason" defaultMessage="举报理由" description="举报理由" />: {item.reportReason}
                        </span>
                    </p>
                </div>
            )
        } else if (data === 3) {
            return (
                <div>
                    <p className="table-item" key="pos2">
                        <span className="table-item-span table-item-w100">
                            <FormattedMessage id="report.report.reason" defaultMessage="举报理由" description="举报理由" />: {item.reportReason}
                        </span>
                    </p>
                </div>
            )
        }
    }

    //渲染举报信息
    renderReportItem(data, item) {
        let { intl, userInfo } = this.props
        return (
            <div className="table-info">
                {
                    userInfo && userInfo.userType === '0' ? '' :
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="report.reporter" defaultMessage="举报人" description="举报人" />: {item.userName}
                            </span>
                        </p>
                }
                <p className="table-item">
                    <span className="item-item-span  table-item-w100">
                        <FormattedMessage id="report.source.type" defaultMessage="来源类型" description="来源类型" />:
          			</span>
                    <span> {intl.locale === 'zh' ? item.reportSourceName : item.reportSourceNameEn}</span>
                </p>
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="global.platform" defaultMessage="平台" description="平台" />: {intl.locale === 'zh' ? item.platformTypeName : item.platformTypeNameEn}
                    </span>
                </p>
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="report.place.shop" defaultMessage="所在店铺" description="所在店铺" />
                        : <span className="item-link">
                            <Tooltip ttile={item.storeUrl}>
                                <a href={item.storeUrl} title={item.storeUrl} target='_blank'>{item.storeName}</a>
                            </Tooltip>
                        </span>
                    </span>
                </p>
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="report.link" defaultMessage="商品链接" description="商品链接" />
                        : <span className="item-link">
                            <Tooltip ttile={item.prodUrl}>
                                <a href={item.prodUrl} title={item.prodUrl} target='_blank'>{item.prodUrl}</a>
                            </Tooltip>
                        </span>
                    </span>
                </p>
                {this.renderReportInfo(data, item)}
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="report.report.time" defaultMessage="举报时间" description="举报时间" />: {item.gmtCreateStr}
                    </span>
                </p>
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="global.audit.time" defaultMessage="审核时间" description="审核时间" />: {item.reportMgrAuditTime}
                    </span>
                </p>
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="global.push.the.time" defaultMessage="推送时间" description="推送时间" />: {item.filterSendTime}
                    </span>
                </p>
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="global.brand.side.confirms.time" defaultMessage="品牌方确认时间" description="品牌方确认时间" />: {item.gmtConfirm}
                    </span>
                </p>
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
                {
                    data === 1 ?
                        <div className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="report.commodity.screenshots" defaultMessage="商品截图" description="商品截图" />:
                                    <div>
                                    {
                                        item.prodPhoto
                                            ? item.prodPhoto.split(",").map(img => {
                                                return (
                                                    <img className="confirmation-img" key={img} src={img} alt="" onClick={() => this.comfirmationModalImg(img ? img.replace('/_', '/') : '')} />
                                                )
                                            })
                                            : ''
                                    }
                                </div>
                            </span>
                        </div> :
                        <div className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="report.screenshot.of.reasons.for.reporting" defaultMessage="举报理由截图" description="举报理由截图" />:
                                    <div>
                                    {
                                        item.reportReasonPhoto
                                            ? item.reportReasonPhoto.split(",").map(img => {
                                                return (
                                                    <img className="confirmation-img" key={img} src={img} alt="" onClick={() => this.comfirmationModalImg(img.replace('/_', '/'))} />
                                                )
                                            })
                                            : ''
                                    }
                                </div>
                            </span>
                        </div>
                }
            </div>
        )
    }

    //渲染官方信息
    renderShopItem(data, item) {
        let { intl } = this.props
        return (
            <div className="table-info">
                <p className="table-item">
                    <span className="table-item-span table-item-w100">
                        <FormattedMessage id="report.subordinate.to.the.brand" defaultMessage="所属品牌" description="所属品牌" />: {item.brandName}
                    </span>
                </p>
                {
                    data === 1 ? [
                        <p className="table-item" key="pic1">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="report.official.website" defaultMessage="官方网址" description="官方网址" />
                                : <span className="item-link">
                                    <Tooltip ttile={item.refChannelUrl}>
                                        <a href={item.refChannelUrl} title={item.refChannelUrl} target='_blank'>{item.refChannelName}</a>
                                    </Tooltip>
                                </span>
                            </span>
                        </p>,
                        <p className="table-item" key="pic2">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="report.links.to.official.merchandise.or.images" defaultMessage="官方商品／图片链接" description="官方商品／图片链接" />
                                : <span className="item-link">
                                    <Tooltip ttile={item.officialProdUrl}>
                                        <a href={item.officialProdUrl} title={item.officialProdUrl} target='_blank'>{item.officialProdUrl}</a>
                                    </Tooltip>
                                </span>
                            </span>
                        </p>,
                        <div className="table-item" key="pic3">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="report.official.merchandise.or.picture.screenshots" defaultMessage="官方商品／图片截图" description="官方商品／图片截图" />:
                                <div>
                                    {
                                        item.officialProdPhoto
                                            ? item.officialProdPhoto.split(",").map(img => {
                                                return (
                                                    <img className="confirmation-img" key={img} src={img} alt="商品截图" onClick={() => this.comfirmationModalImg(img.replace('/_', '/'))} />
                                                )
                                            })
                                            : ''
                                    }
                                </div>
                            </span>
                        </div>
                    ] : data === 2 ? [
                        <p className="table-item" key="kind1">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="report.category" defaultMessage="商品类目" description="商品类目" />:
                                {
                                    intl.locale === 'zh'
                                        ? <Tooltip title={item.prodTypeName}>{item.prodTypeName.slice(0, 15)}...</Tooltip>
                                        : <Tooltip title={item.prodTypeNameEn}>{item.prodTypeNameEn.slice(0, 15)}...</Tooltip>
                                }
                            </span>
                        </p>,
                        <div className="table-item" key="kind2">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="report.trademark" defaultMessage="商标" description="商标" />
                                : {
                                    item.refChannelId === -1
                                        ? '无商标'
                                        : item.refChannelName
                                            ? item.refChannelName
                                            : item.refChannelUrl
                                                ? (
                                                    <div>
                                                        <img className="confirmation-img" src={item.refChannelUrl} alt="商标" onClick={() => this.comfirmationModalImg(item.trademarkTypeUrl.replace('/_', '/'))} />
                                                    </div>
                                                )
                                                : ''
                                }
                            </span>
                        </div>
                    ] : data === 3 ? [
                        <p className="table-item" key="kind1">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="report.category" defaultMessage="商品类目" description="商品类目" />:
                                {
                                    intl.locale === 'zh'
                                        ? <Tooltip title={item.prodTypeName}>{item.prodTypeName.slice(0, 15)}...</Tooltip>
                                        : <Tooltip title={item.prodTypeNameEn}>{item.prodTypeNameEn.slice(0, 15)}...</Tooltip>
                                }
                            </span>
                        </p>,
                        <p className="table-item" key="pic1">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="monitor.image.of.infringement" defaultMessage="侵权形象" description="侵权形象" />
                                : <span className="item-link">
                                    {item.refChannelName}
                                </span>
                            </span>
                        </p>
                    ] : ""
                }
            </div>
        )
    }

    //渲染状态
    renderStatus(text, item) {
        let { intl } = this.props
        return (
            <div>
                <div style={{ color: 'red' }}>
                    {
                        intl.locale === 'zh' ? item.whiteTypeName : item.whiteTypeNameEn
                    }
                </div>
                <div>
                    {
                        intl.locale === 'en' ? item.auditStatusNameEn : item.auditStatusName
                    }
                </div>
                <div>
                    {
                        item.confirmReason ? `(${item.confirmReason})` : ''
                    }
                </div>
            </div>
        )
    }

    renderOperate(record) {
        let { permissionList } = this.props
        if (record.auditStatus === 6) {
            return (
                getButtonPrem(permissionList, '004005001') ?
                    <div>
                        <a onClick={() => this.signalCheck(record)}><FormattedMessage id="global.push" defaultMessage="推送" description="推送" /></a>
                    </div> : ''
            )
        }
    }

    // 排序筛选
    changeSortOrder(pagination, filters, sorter) {
        let { searchData } = this.state;
        if (sorter.order === 'ascend') {            
            if (sorter.columnKey === "whatAuditNum") {
                searchData.orderParam = 1;
				searchData.orderType = 2;
            } else if (sorter.columnKey === "vSuccNum") {
                searchData.orderParam = 2;
				searchData.orderType = 2;
            } else if (sorter.columnKey === "noSuccNum") {
                searchData.orderParam = 3;
				searchData.orderType = 2;
            }else if (sorter.columnKey === 'whatFilterNum') {
                searchData.orderParam = 4;
                searchData.orderType = 2;
            }else if (sorter.columnKey === 'confirmAbnormal') {
                searchData.orderParam = 5;
				searchData.orderType = 2;
            }
        } else {
            if (sorter.columnKey === "whatAuditNum") {
                searchData.orderParam = 1;
                searchData.orderType = 1;
            } else if (sorter.columnKey === "vSuccNum") {
                searchData.orderParam = 2;
                searchData.orderType = 1;
            } else if (sorter.columnKey === "noSuccNum") {
                searchData.orderParam = 3;
                searchData.orderType = 1;
            }else if (sorter.columnKey === 'whatFilterNum') {
                searchData.orderParam = 4;
                searchData.orderType = 1;
            }else if (sorter.columnKey === 'confirmAbnormal') {
                searchData.orderParam = 5;
                searchData.orderType = 1;
            }
        }
        this.setState({
            searchData: searchData,
        }, () => {
            this.getFilterStorePage([], 1)
        })
    }
    // tab切换时
    changePageTab(key) {
        this.setState({
            tabActiveKey: key
        }, () => {
            if (key === 'shop') {
                let { shopPageNo = 1 } = this.props;
                this.getConfirmationList([], shopPageNo)
            } else {
                let { storePageNo = 1 } = this.props;
                this.getFilterStorePage([], storePageNo)
            }
        })
    }

    // 页码改变时获取
    pageChange(pageNo) {
        let { tabActiveKey } = this.state;
        if (tabActiveKey === 'shop') {
            this.getConfirmationList([], pageNo)
        } else {
            // 请求店铺列表
            this.getFilterStorePage([], pageNo)
        }
    }

    // 设置页码大小
    setPageSize(pageSize) {
        let { tabActiveKey } = this.state;
        if (tabActiveKey === 'shop') {
            this.setState({
                shopPageSize: pageSize
            }, () => {
                this.getConfirmationList([], 1)
            })
        } else {
            // 请求店铺列表
            this.setState({
                storePageSize: pageSize
            }, () => {
                this.getFilterStorePage([], 1)
            })
        }
    }

    // 设置分页器
    renderPagination(pageNo, pageSize, total) {
        return (
            <Pagination
                showSizeChanger
                showQuickJumper
                total={total}
                current={pageNo}
                pageSize={pageSize}
                onChange={page => this.pageChange(page)}
                onShowSizeChange={(page, size) => this.setPageSize(size)}
            />
        );
    }

    createShopTableOption() {
        let { intl } = this.props
        let { indeterminate } = this.state;
        const columns = [
            {
                title: <Checkbox value='all' indeterminate={indeterminate} onChange={e => this.selectAll(e)} />,
                width: '5%',
                dataIndex: 'id',
                key: 'checkbox',
                render: (text, item) => <Checkbox value={text} disabled={item.auditStatus !== 6} onChange={e => this.selectItem(e, item)} />
            }, {
                title: <FormattedMessage id="report.reporting.information" defaultMessage="举报信息" description="举报信息" />,
                width: '30%',
                dataIndex: 'reportType',
                key: 'id',
                render: (report, item) => this.renderReportItem(report, item)
            }, {
                title: <FormattedMessage id="report.the.official.information" defaultMessage="官方信息" description="官方信息" />,
                width: '30%',
                dataIndex: 'reportType',
                key: 'gmtAudit',
                render: (shop, item) => this.renderShopItem(shop, item)
            }, {
                title: <FormattedMessage id="report.report.type" defaultMessage="举报类型" description="举报类型" />,
                dataIndex: 'reportType',
                key: 'reportType',
                width: '10%',
                render: (text, record) => {
                    return (
                        <span>{intl.locale === 'zh' ? record.reportTypeName : record.reportTypeNameEn}</span>
                    )
                }
            }, {
                title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
                dataIndex: 'auditStatus',
                key: 'auditStatus',
                width: '15%',
                render: (text, item) => this.renderStatus(text, item)
            }, {
                title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
                dataIndex: 'auditStatus',
                key: 'operation',
                width: '10%',
                render: (text, record) => this.renderOperate(record)
            }
        ];
        return columns
    }

    createStoreTableOption() {
        let { intl } = this.props;
        let { searchData } = this.state;
        const columns = [
            {
                title: <FormattedMessage id="global.platform" defaultMessage="平台" description="平台" />,
                dataIndex: 'platformType',
                key: 'platformType',
                render: (text, item) => (
                    intl.locale === 'en'
                        ? item.platformTypeNameEn
                        : item.platformTypeName
                )
            }, {
                title: <FormattedMessage id="global.crawler.filter.type.store.name" defaultMessage="店铺名称" description="店铺名称" />,
                dataIndex: 'storeName',
                key: 'storeName',
                render: (text, item) => item.storeUrl ? <a href={item.storeUrl} title={text} target='_blank'>{text}</a> : text
            }, {
                title: <FormattedMessage id="global.no.push" defaultMessage="待推送" description="待推送" />,
                dataIndex: 'whatFilterNum',
                key: 'whatFilterNum',                
                sorter: true,
                render: (text, item) => (
                    text > 0
                        ? <Link
                            to={
                                `/volunteer/reportScreen/list?userName=${searchData.userNameLikeOrMobile ? searchData.userNameLikeOrMobile : ''}
								&reportType=${searchData.reportType ? searchData.reportType : ''}
								&brandId=${searchData.brandId ? searchData.brandId : ''}
								&queryUrl=${searchData.queryUrl ? searchData.queryUrl : ''}
								&reportSourceType=${searchData.reportSourceType ? searchData.reportSourceType : ''}
								&prodTypeId=${searchData.prodTypeId ? searchData.prodTypeId : ''}
								&gmtCreateStart=${searchData.gmtCreateStart ? searchData.gmtCreateStart : ''}
								&gmtCreateEnd=${searchData.gmtCreateEnd ? searchData.gmtCreateEnd : ''}
								&reportReasonId=${searchData.reportReasonId ? searchData.reportReasonId : ''}
								&trademarkId=${searchData.trademarkId ? searchData.trademarkId : ''}
								&platformType=${item.platformType ? item.platformType : ''}&storeName=${encodeURIComponent(item.storeName)}&remarkLikeRight=${searchData.remarkLikeRight ? searchData.remarkLikeRight : ''}&filterSendTimeStart=${searchData.filterSendTimeStart ? searchData.filterSendTimeStart : ''}&filterSendTimeEnd=${searchData.filterSendTimeEnd ? searchData.filterSendTimeEnd : ''}
								&auditStatus=${6}`
                            }
                            target='_blank'
                        >
                            {text}
                        </Link>
                        : text
                )
            }, {
                title: <FormattedMessage id="brand.side.audited" defaultMessage="品牌方待审核" description="品牌方待审核" />,
                dataIndex: 'whatAuditNum',
                key: 'whatAuditNum',
                sorter: true,
                render: (text, item) => (
                    text > 0
                        ? <Link
                            to={
                                `/volunteer/reportScreen/list
								?userName=${searchData.userNameLikeOrMobile ? searchData.userNameLikeOrMobile : ''}
								&reportType=${searchData.reportType ? searchData.reportType : ''}
								&brandId=${searchData.brandId ? searchData.brandId : ''}
								&queryUrl=${searchData.queryUrl ? searchData.queryUrl : ''}
								&reportSourceType=${searchData.reportSourceType ? searchData.reportSourceType : ''}
								&prodTypeId=${searchData.prodTypeId ? searchData.prodTypeId : ''}
								&gmtCreateStart=${searchData.gmtCreateStart ? searchData.gmtCreateStart : ''}
								&gmtCreateEnd=${searchData.gmtCreateEnd ? searchData.gmtCreateEnd : ''}
								&reportReasonId=${searchData.reportReasonId ? searchData.reportReasonId : ''}
								&trademarkId=${searchData.trademarkId ? searchData.trademarkId : ''}
								&platformType=${item.platformType ? item.platformType : ''}&storeName=${encodeURIComponent(item.storeName)}&remarkLikeRight=${searchData.remarkLikeRight ? searchData.remarkLikeRight : ''}&filterSendTimeStart=${searchData.filterSendTimeStart ? searchData.filterSendTimeStart : ''}&filterSendTimeEnd=${searchData.filterSendTimeEnd ? searchData.filterSendTimeEnd : ''}
								&auditStatus=${1}`
                            }
                            target='_blank'
                        >
                            {text}
                        </Link>
                        : text
                )
            }, {
                title: <FormattedMessage id="brand.side.audit.pass" defaultMessage="品牌方审核通过" description="品牌方审核通过" />,
                dataIndex: 'vSuccNum',
                key: 'vSuccNum',
                sorter: true,
                render: (text, item) => (
                    text > 0
                        ? <Link
                            to={
                                `/volunteer/reportScreen/list
								?userName=${searchData.userNameLikeOrMobile ? searchData.userNameLikeOrMobile : ''}
								&reportType=${searchData.reportType ? searchData.reportType : ''}
								&brandId=${searchData.brandId ? searchData.brandId : ''}
								&queryUrl=${searchData.queryUrl ? searchData.queryUrl : ''}
								&reportSourceType=${searchData.reportSourceType ? searchData.reportSourceType : ''}
								&prodTypeId=${searchData.prodTypeId ? searchData.prodTypeId : ''}
								&gmtCreateStart=${searchData.gmtCreateStart ? searchData.gmtCreateStart : ''}
								&gmtCreateEnd=${searchData.gmtCreateEnd ? searchData.gmtCreateEnd : ''}
								&reportReasonId=${searchData.reportReasonId ? searchData.reportReasonId : ''}
								&trademarkId=${searchData.trademarkId ? searchData.trademarkId : ''}
								&platformType=${item.platformType ? item.platformType : ''}&storeName=${encodeURIComponent(item.storeName)}&remarkLikeRight=${searchData.remarkLikeRight ? searchData.remarkLikeRight : ''}&filterSendTimeStart=${searchData.filterSendTimeStart ? searchData.filterSendTimeStart : ''}&filterSendTimeEnd=${searchData.filterSendTimeEnd ? searchData.filterSendTimeEnd : ''}
								&auditStatus=${4}`
                            }
                            target='_blank'
                        >
                            {text}
                        </Link>
                        : text
                )
            }, {
                title: <FormattedMessage id="brand.side.audit.no.pass" defaultMessage="品牌方审核不通过" description="品牌方审核不通过" />,
                dataIndex: 'noSuccNum',
                key: 'noSuccNum',
                sorter: true,
                render: (text, item) => (
                    text > 0
                        ? <Link
                            to={
                                `/volunteer/reportScreen/list
								?userName=${searchData.userNameLikeOrMobile ? searchData.userNameLikeOrMobile : ''}
								&reportType=${searchData.reportType ? searchData.reportType : ''}
								&brandId=${searchData.brandId ? searchData.brandId : ''}
								&queryUrl=${searchData.queryUrl ? searchData.queryUrl : ''}
								&reportSourceType=${searchData.reportSourceType ? searchData.reportSourceType : ''}
								&prodTypeId=${searchData.prodTypeId ? searchData.prodTypeId : ''}
								&gmtCreateStart=${searchData.gmtCreateStart ? searchData.gmtCreateStart : ''}
								&gmtCreateEnd=${searchData.gmtCreateEnd ? searchData.gmtCreateEnd : ''}
								&reportReasonId=${searchData.reportReasonId ? searchData.reportReasonId : ''}
								&trademarkId=${searchData.trademarkId ? searchData.trademarkId : ''}
								&platformType=${item.platformType ? item.platformType : ''}&storeName=${encodeURIComponent(item.storeName)}&remarkLikeRight=${searchData.remarkLikeRight ? searchData.remarkLikeRight : ''}&filterSendTimeStart=${searchData.filterSendTimeStart ? searchData.filterSendTimeStart : ''}&filterSendTimeEnd=${searchData.filterSendTimeEnd ? searchData.filterSendTimeEnd : ''}
								&auditStatus=${3}`
                            }
                            target='_blank'
                        >
                            {text}
                        </Link>
                        : text
                )
            }, {
                title: <FormattedMessage id="brand.side.exception.handling" defaultMessage="品牌方异常处理" description="品牌方异常处理" />,
                dataIndex: 'confirmAbnormal',
                key: 'confirmAbnormal',
                sorter: true,
                render: (text, item) => (
                    text > 0
                        ? <Link
                            to={
                                `/volunteer/reportScreen/list?userName=${searchData.userNameLikeOrMobile ? searchData.userNameLikeOrMobile : ''}
								&reportType=${searchData.reportType ? searchData.reportType : ''}
								&brandId=${searchData.brandId ? searchData.brandId : ''}
								&queryUrl=${searchData.queryUrl ? searchData.queryUrl : ''}
								&reportSourceType=${searchData.reportSourceType ? searchData.reportSourceType : ''}
								&prodTypeId=${searchData.prodTypeId ? searchData.prodTypeId : ''}
								&gmtCreateStart=${searchData.gmtCreateStart ? searchData.gmtCreateStart : ''}
								&gmtCreateEnd=${searchData.gmtCreateEnd ? searchData.gmtCreateEnd : ''}
								&reportReasonId=${searchData.reportReasonId ? searchData.reportReasonId : ''}
								&trademarkId=${searchData.trademarkId ? searchData.trademarkId : ''}
								&platformType=${item.platformType ? item.platformType : ''}&storeName=${encodeURIComponent(item.storeName)}&remarkLikeRight=${searchData.remarkLikeRight ? searchData.remarkLikeRight : ''}&filterSendTimeStart=${searchData.filterSendTimeStart ? searchData.filterSendTimeStart : ''}&filterSendTimeEnd=${searchData.filterSendTimeEnd ? searchData.filterSendTimeEnd : ''}
								&auditStatus=${5}`
                            }
                            target='_blank'
                        >
                            {text}
                        </Link>
                        : text
                )
            }

        ]
        return columns;
    }

    render() {
        let { startDate, endDate, showImg, userNameLikeOrMobile, reportType, storeName,
            platformType, auditStatus, visibleImg,
            brandId, chooseCount, selectedRowKeys, queryUrl, prodTypeId,
            reportReasonId, trademarkId, visibleExcelExport, autoTitleParam, tbName,
            reportSourceType, tabActiveKey, shopPageSize, storePageSize, remarkLikeRight,
            filterSendTimeStartDate, filterSendTimeEndDate
        } = this.state;
        let { platfromList, volunteerScreen, isFetch, intl, permissionList,
            userInfo, reportOperationScreen, brandList, prodList, reportReasonQueryList,
            tardemarkQueryList, exportExcelTitle, reportResourceType, volunteerStoreScreen,
            total, pageNo, storePageNo, storeTotal
        } = this.props;
        let reportTypeStatus = this.props.reportType
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.volunteer.management', title: '志愿者举报管理' },
            { link: '', titleId: 'router.volunteer.operation.screening', title: '运营筛选' }
        ]
        return (
            <Content breadcrumbData={breadcrumbData} className="confirmation-wrapper">
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.platform", defaultMessage: "所在平台", description: "所在平台" })}>
                                <Select
                                    onChange={(e) => this.handleSelectChange(e, 'platformType')}
                                    value={platformType}
                                    placeholder={intl.formatMessage({ id: "report.please.select.the.platform", defaultMessage: "请选择所在平台", description: "请选择所在平台" })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Select.Option value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </Select.Option>
                                    {
                                        platfromList && platfromList.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "report.subordinate.to.the.brand", defaultMessage: "所属品牌", description: "所属品牌" })}>
                                <Select
                                    showSearch
                                    value={brandId}
                                    dropdownMatchSelectWidth={true}
                                    onChange={val => this.handleChangeBrand(val)}
                                    placeholder={intl.formatMessage({ id: "report.please.select.your.own.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Select.Option value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </Select.Option>
                                    {
                                        brandList && brandList.filter(item => item.isDelete === 0)
                                            .map(opt => <Select.Option key={opt.id} value={opt.id}>{opt.name}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "report.report.type", defaultMessage: "举报类型", description: "举报类型" })}>
                                <Select
                                    onChange={(e) => this.handleSelectChange(e, 'reportType')}
                                    value={reportType}
                                    placeholder={intl.formatMessage({ id: "report.please.select.report.type", defaultMessage: "请选择举报类型", description: "请选择举报类型" })}
                                >
                                    <Select.Option value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </Select.Option>
                                    {
                                        reportTypeStatus && reportTypeStatus.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "report.to.report.status", defaultMessage: "举报状态", description: "举报状态" })}>
                                <Select
                                    onChange={(e) => this.handleSelectChange(e, 'auditStatus')}
                                    value={auditStatus}
                                    placeholder={intl.formatMessage({ id: "report.please.select.report.status", defaultMessage: "请选择举报状态", description: "请选择举报状态" })}
                                >
                                    <Select.Option value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </Select.Option>
                                    {
                                        reportOperationScreen && reportOperationScreen.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "report.trademark", defaultMessage: "商标", description: "商标" })}>
                                <Select
                                    showSearch
                                    value={trademarkId}
                                    dropdownMatchSelectWidth={true}
                                    filterOption={false}
                                    defaultActiveFirstOption={false}
                                    onSearch={val => this.handleSearchTrademark(val)}
                                    onChange={(e) => this.handleSelectChange(e, 'trademarkId')}
                                    placeholder={intl.formatMessage({ id: "report.please.select.trademark", defaultMessage: "请选择商标", description: "请选择商标" })}
                                >
                                    <Select.Option value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </Select.Option>
                                    {
                                        tardemarkQueryList && tardemarkQueryList.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.id} value={opt.id}>{opt.vrLabel}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "global.prod.url", defaultMessage: "商品链接", description: "商品链接" })}>
                                <Input
                                    value={queryUrl}
                                    onPressEnter={(e) => this.handleSearch()}
                                    onChange={e => this.setState({ queryUrl: e.target.value.trim() })}
                                    placeholder={intl.formatMessage({ id: "global.please.enter.prod.url", defaultMessage: "请输入商品链接", description: "请输入商品链接" })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "report.category", defaultMessage: "商品类目", description: "商品类目" })}>
                                <Select
                                    showSearch
                                    value={prodTypeId}
                                    dropdownMatchSelectWidth={true}
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
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "report.report.reason", defaultMessage: "举报理由", description: "举报理由" })}>
                                <Select
                                    showSearch
                                    value={reportReasonId}
                                    dropdownMatchSelectWidth={true}
                                    filterOption={false}
                                    defaultActiveFirstOption={false}
                                    onSearch={val => this.handleSearchReportReason(val)}
                                    onChange={(e) => this.handleSelectChange(e, 'reportReasonId')}
                                    placeholder={intl.formatMessage({ id: "report.please.select.report.reason", defaultMessage: "请选择举报理由", description: "请选择举报理由" })}
                                >
                                    <Select.Option value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </Select.Option>
                                    {
                                        reportReasonQueryList && reportReasonQueryList.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.id} value={opt.id}>{opt.vrLabel}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="time-row">
                            <Form.Item label={intl.formatMessage({ id: "report.times", defaultMessage: "开始时间", description: "开始时间" })}>
                                <Row>
                                    <Col span={11}>
                                        <DatePicker
                                            value={startDate}
                                            style={{ width: 'auto' }}
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')}
                                        />
                                    </Col>
                                    <Col span={2} className="time-span-2">~</Col>
                                    <Col span={11}>
                                        <DatePicker
                                            value={endDate}
                                            style={{ width: 'auto' }}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>                            
                        </Col>
                        <Col span={6}>
                            <Form.Item label={intl.formatMessage({ id: "report.source.type", defaultMessage: "来源类型", description: "来源类型" })}>
                                <Select
                                    onChange={(e) => this.handleSelectChange(e, 'reportSourceType')}
                                    value={reportSourceType}
                                    placeholder={intl.formatMessage({ id: "report.please.select.report.source", defaultMessage: "请选择来源类型", description: "请选择举报来源" })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Select.Option value="">
                                        <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
                                    </Select.Option>
                                    {
                                        reportResourceType && reportResourceType.filter(item => item.isDel === 0)
                                            .map(opt => <Select.Option key={opt.dictVal} value={opt.dictVal}>{intl.locale === 'zh' ? opt.dictLabel : opt.dictLabelEn}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label={intl.formatMessage({ id: "monitor.storeName", defaultMessage: "店铺名称", description: "店铺名称" })}
                            >
                                <Input
                                    value={storeName}
                                    onPressEnter={(e) => this.handleSearch()}
                                    onChange={e => this.setState({ storeName: e.target.value.trim() })}
                                    placeholder={intl.formatMessage({ id: "monitor.input.storeName", defaultMessage: "请输入店铺名称", description: "请输入店铺名称" })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="time-row">
                            <Form.Item label={intl.formatMessage({ id: "report.push.time", defaultMessage: "推送时间", description: "推送时间" })}>
                                <Row>
                                    <Col span={11}>
                                        <DatePicker
                                            value={filterSendTimeStartDate}
                                            style={{ width: 'auto' }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            showTime={{ format: 'HH:mm:ss' }}
                                            onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'filterSendTimeStart')}
                                        />
                                    </Col>
                                    <Col span={2} className="time-span-2">~</Col>
                                    <Col span={11}>
                                        <DatePicker
                                            value={filterSendTimeEndDate}
                                            style={{ width: 'auto' }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            showTime={{ format: 'HH:mm:ss' }}
                                            onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'filterSendTimeEnd')}
                                        />
                                    </Col>
                                </Row>
                            </Form.Item>                            
                        </Col>
                        {
                            userInfo && userInfo.userType === '0' ? '' :
                                <Col span={6}>
                                    <Form.Item label={intl.formatMessage({ id: "report.reporter", defaultMessage: "举报人", description: "举报人" })}>
                                        <Input onPressEnter={(e) => this.handleSearch()} placeholder={intl.formatMessage({ id: "report.please.enter.userName", defaultMessage: "请输入举报人", description: "请输入举报人" })} value={userNameLikeOrMobile} onChange={e => this.setState({ userNameLikeOrMobile: e.target.value.trim() })} />
                                    </Form.Item>
                                </Col>
                        }
                        <Col span={6}>
                            <Form.Item
                                label={intl.formatMessage({ id: "case.note", defaultMessage: "备注", description: "备注" })}
                            >
                                <Input
                                    value={remarkLikeRight}
                                    onPressEnter={(e) => this.handleSearch()}
                                    onChange={e => this.setState({ remarkLikeRight: e.target.value.trim() })}
                                    placeholder={intl.formatMessage({ id: "report.please.enter.note", defaultMessage: "请输入备注", description: "请输入备注" })}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} offset={18}>
                            <div style={{ float: 'right' }}>
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
                            getButtonPrem(permissionList, '004005001') ?
                                <Button type="primary" style={{ marginRight: '15px' }} onClick={() => this.allCheck()}>
                                    <FormattedMessage id="report.batch.screening" defaultMessage="批量推送" description="批量推送" />
                                </Button> : ''
                        }
                        {
                            getButtonPrem(permissionList, '004005004') ?
                                <Upload
                                    action={Req.uploadFile}
                                    showUploadList={false}
                                    withCredentials={true}
                                    onChange={file => this.importExcel(file)}
                                    beforeUpload={(file) => this.beforeUpload(file)}
                                >
                                    <Button className="first upload-inport-style"><FormattedMessage id="global.import" defaultMessage="导入" description="导入" /></Button>
                                </Upload> : ''
                        }
                        {
                            getButtonPrem(permissionList, '004005005')
                                ? <Button onClick={() => this.showExportExcelModal()}>
                                    <FormattedMessage id="global.export" defaultMessage="导出" description="导出" />
                                </Button>
                                : ''
                        }
                        {
                            getButtonPrem(permissionList, '004005006')
                                ? <a style={{ marginLeft: '15px', color: '#668fff' }} download="运营筛选导入模板" href={Req.downloadExcelTemplate + `?num=10`}>
                                    <FormattedMessage id="global.download.import.template" defaultMessage="下载导入模板" description="下载导入模板" />
                                </a>
                                : ''
                        }
                    </Col>
                </Row>
                <Alert message={intl.formatMessage({ id: "brand.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据，已选择 (${{ chooseCount: chooseCount }}) 条数据`, description: `界面共（100）条数据` }, { count: total, chooseCount: chooseCount })} type="info" showIcon className="Alert_info" />
                <Tabs
                    defaultActiveKey='shop'
                    activeKey={tabActiveKey}
                    onChange={activeKey => this.changePageTab(activeKey)}
                >
                    <TabPane tab='商品' key='shop'>
                        <CheckboxGroup value={selectedRowKeys} style={{ width: '100%' }}>
                            <Table
                                className="report-tabel"
                                dataSource={volunteerScreen}
                                columns={this.createShopTableOption()}
                                rowKey={record => record.id}
                                loading={isFetch}
                                pagination={false}
                            />
                            {this.renderPagination(pageNo, shopPageSize, total)}
                        </CheckboxGroup>
                    </TabPane>
                    {
                        getButtonPrem(permissionList, '004005007') ?
                            <TabPane tab='店铺' key='store'>
                                <Table
                                    className="report-tabel"
                                    dataSource={volunteerStoreScreen}
                                    columns={this.createStoreTableOption()}
                                    rowKey={record => record.id}
                                    loading={isFetch}
                                    pagination={false}
                                    onChange={(pagination, filters, sorter) => this.changeSortOrder(pagination, filters, sorter)}
                                />
                                {this.renderPagination(storePageNo, storePageSize, storeTotal)}
                            </TabPane> : ''
                    }
                </Tabs>
                <PictureModal
                    onCancel={() => this.setState({ visibleImg: false })}
                    visible={visibleImg}
                    showImg={showImg}
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

export default OperationScreening