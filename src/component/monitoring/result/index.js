import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Card, Col, Row, Table, Input, Select, DatePicker, Button, Alert, message, Pagination, Modal, Tooltip, Checkbox } from 'antd'
import { FormattedMessage } from 'react-intl'
import Content from '../../common/layout/content/index'
import InputNumber from '../../common/form/numberInput'
import { formatDateToMs, getButtonPrem, getFormatDate, getName } from '../../../utils/util'
import ExcelExportModal from '../../common/layout/modal/exportExcelModal'
import './index.css'
import moment from 'moment'
import PictureModal from '../../common/layout/modal/pictureModal'
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const CheckboxGroup = Checkbox.Group;

const xin = require('../../../assets/images/xin.gif');
const zuan = require('../../../assets/images/zuan.gif');
const guan = require('../../../assets/images/guan.gif');
const hg = require('../../../assets/images/huanguan.gif');

export default class MonitorResultList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: '',
            startTimeMs: '',
            startDate: null,
            endTime: '',
            endTimeMs: '',
            endDate: null,
            pageSize: 10,
            monitorId: '',
            queryUrl: '',
            ownedBrand: undefined,
            platformTypeId: undefined,
            auditStatus: undefined,
            prodTypeId: undefined,
            authorizedStatus: '1',
            checkedAll: false,
            indeterminate: false,
            selectedRowKeys: [],
            selectedRow: [],
            excludeIdList: [],
            idList: [],
            allData: '',
            chooseCount: 0,
            chooseTotal: 0,
            searchData: {
                ownedBrand: '',
                monitorId: '',
                startTime: '',
                endTime: '',
                platformTypeId: '',
                auditStatus: '',
                type: '1',
                queryUrl: '',
                prodTypeId: ''
            },
            visible: false,
            auditId: '',
            images: {
                img1: require('../../../assets/images/one.png'),
                img2: require('../../../assets/images/two.png'),
                img3: require('../../../assets/images/three.png'),
                img4: require('../../../assets/images/four.png'),
                img5: require('../../../assets/images/five.png'),
                img6: require('../../../assets/images/six.png'),
                img7: require('../../../assets/images/seven.jpg'),
                img8: require('../../../assets/images/eight.jpg')
            },
            allotNum: '',
            volunteerId: undefined,
            reason: '',
            editType: '',
            visibleExcelExport: false,  // 自定义导出数据的弹窗控制
            autoTitleParam: [],  //  自定义数据
            autoPageNum: 100,  // 自定义数据量
            tbName: '监控结果-' + getFormatDate('yyyy-MM-dd-hh:mm')
        }
    }

    componentWillMount() {
        let { history, monitorResultList, searchData } = this.props;
        // 判断页面跳转状态  POP返回操作
        if ((history.action === 'POP' || (history.location.query && history.location.query.goBack)) && monitorResultList.length) {
            let { auditStatus = undefined, startTime = '', endTime = '', ownedBrand = '', monitorId = '' } = searchData;
            let stateSearchData = Object.assign(this.state.searchData, searchData)
            let { pageNo } = this.props;
            this.setState({
                auditStatus: auditStatus,
                startTime: startTime,
                startDate: startTime ? moment(startTime, "YYYY-MM-DD") : null,
                endTime: endTime,
                endDate: endTime ? moment(endTime, "YYYY-MM-DD") : null,
                ownedBrand: ownedBrand,
                monitorId: monitorId,
                searchData: stateSearchData
            },()=>{
                this.getMonitorList([], pageNo)
            })
        } else {
            // 带参数跳转操作
            if (history.location.query) {
                let { auditStatus, startTime, endTime, ownedBrand, monitorId } = history.location.query;
                if (startTime) {
                    startTime = startTime.split(' ')[0];
                } else {
                    startTime = ''
                }
                if (endTime) {
                    endTime = endTime.split(' ')[0];
                } else {
                    endTime = ''
                }
                let searchData = {
                    ownedBrand: ownedBrand === undefined ? '' : ownedBrand,
                    monitorId: monitorId === undefined ? '' : monitorId,
                    startTime,
                    endTime,
                    platformTypeId: '',
                    auditStatus: auditStatus === undefined ? '' : auditStatus
                }
                let stateSearchData = Object.assign(this.state.searchData, searchData)
                this.setState({
                    auditStatus,
                    startTime,
                    startDate: startTime ? moment(startTime, "YYYY-MM-DD") : null,
                    endTime,
                    endDate: endTime ? moment(startTime, "YYYY-MM-DD") : null,
                    ownedBrand: ownedBrand,
                    monitorId: monitorId,
                    searchData: stateSearchData
                }, () => this.getMonitorList([], 1))
            } else if (this.props.searchData && history.action === 'POP') {
                let { searchData } = this.props;
                this.setState({
                    platformTypeId: searchData.platformTypeId !== '' ? searchData.platformTypeId : undefined,
                    ownedBrand: searchData.ownedBrand !== '' ? searchData.ownedBrand : undefined,
                    auditStatus: searchData.auditStatus !== '' ? searchData.auditStatus : undefined,
                    prodTypeId: searchData.prodTypeId !== '' ? searchData.prodTypeId : undefined,
                    monitorId: searchData.monitorId,
                    startTime: searchData.startTime,
                    startDate: searchData.startTime ? moment(searchData.startTime, "YYYY-MM-DD") : null,
                    endTime: searchData.endTime,
                    endDate: searchData.endTime ? moment(searchData.endTime, "YYYY-MM-DD") : null,
                    queryUrl: searchData.queryUrl,
                    authorizedStatus: searchData.type,
                    searchData: searchData
                }, () => {
                    this.getMonitorList([], searchData.pageNo)
                })
            } else {
                // 不带参数跳转
                let endTime = getFormatDate('yyyy-MM-dd');
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
                startTime = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
                let searchData = this.state.searchData;
                searchData.startTime = startTime;
                searchData.endTime = endTime;
                this.setState({
                    startTime,
                    startDate: moment(startTime, "YYYY-MM-DD"),
                    endTime,
                    endDate: moment(endTime, "YYYY-MM-DD"),
                    searchData
                }, () => {
                    this.getMonitorList([], 1)
                })
            }
        }
        if (this.props.getExportExcelTitle) {
            this.props.getExportExcelTitle({ excelType: 4 })
        }
    }


    componentWillReceiveProps(nextProps) {
        let { selectedRowKeys, selectedRow, allData, excludeIdList } = this.state;
        if (nextProps.monitorResultList !== this.props.monitorResultList && allData === 'all') {
            for (let i = 0; i < nextProps.monitorResultList.length; i++) {
                const element = nextProps.monitorResultList[i];
                if (selectedRowKeys.indexOf(element.id) === -1 && element.auditStatus === 0 && element.isHide !== 10 && excludeIdList.indexOf(element.id) === -1) {
                    selectedRowKeys.push(element.id);
                    selectedRow.push(element)
                }
            }
            this.setState({ selectedRowKeys, selectedRow })
        }
    }
    //判断搜索条件是否与页面显示一致
    getCondition() {
        let { monitorId, ownedBrand, platformTypeId, auditStatus, startTime, endTime, queryUrl, prodTypeId, searchData} = this.state
        if(
            monitorId !== searchData.monitorId 
            || (ownedBrand !== undefined && ownedBrand !== searchData.ownedBrand) 
            || (platformTypeId !== undefined && platformTypeId !== searchData.platformTypeId) 
            || (auditStatus !== undefined && auditStatus !== searchData.auditStatus)
            || startTime !== searchData.startTime || endTime !== searchData.endTime 
            || queryUrl !== searchData.queryUrl 
            || (prodTypeId !== undefined && prodTypeId !== searchData.prodTypeId)
            ) {
                message.info('当前条件与查询条件不一致，请搜索后操作');
                return false
        }else {
            return true
        }
    }
    // 获取数据
    getMonitorList(oldList, pageNo) {
        let { searchData, pageSize } = this.state;
        let { getMonitorList } = this.props;
        let data = Object.assign({}, searchData)
        data.queryUrl = encodeURIComponent(searchData.queryUrl);
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        getMonitorList(oldList, data)
    }

    // 改变分页大小
    changePageSize(size) {
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

    // 搜索
    handleSearch() {
        let { platformTypeId, ownedBrand, auditStatus, monitorId, startTime, endTime, searchData, authorizedStatus, queryUrl, prodTypeId } = this.state;
        searchData = {
            platformTypeId: platformTypeId === undefined ? '' : platformTypeId,
            ownedBrand: ownedBrand === undefined ? '' : ownedBrand,
            auditStatus: auditStatus === undefined ? '' : auditStatus,
            prodTypeId: prodTypeId === undefined ? '' : prodTypeId,
            monitorId: monitorId,
            startTime: startTime,
            endTime: endTime,
            type: authorizedStatus,
            queryUrl
        }
        this.setState({
            searchData,
            indeterminate: false,
            selectedRowKeys: [],
            selectedRow: [],
            excludeIdList: [],
            idList: [],
            allData: '',
            chooseCount: 0,
            chooseTotal: 0,
        }, () => this.getMonitorList([], 1))
    }

    // 重置
    handleReset() {
        let searchData = {
            ownedBrand: '',
            monitorId: '',
            startTime: '',
            endTime: '',
            platformTypeId: '',
            auditStatus: '',
            type: '1',
            queryUrl: '',
            prodTypeId: ''
        }
        this.setState({
            ownedBrand: undefined,
            monitorId: '',
            startTime: '',
            startDate: null,
            endTime: '',
            endDate: null,
            platformTypeId: undefined,
            auditStatus: undefined,
            prodTypeId: undefined,
            title: '',
            indeterminate: false,
            selectedRowKeys: [],
            selectedRow: [],
            excludeIdList: [],
            idList: [],
            allData: '',
            chooseCount: 0,
            chooseTotal: 0,
            checkedAll: false,
            authorizedStatus: '1',
            queryUrl: '',
            searchData
        }, () => {
            this.getMonitorList([], 1)
        })
    }
    //输入框change事件
    handleChange(value, type) {
        this.setState({
            [type]: value
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
            onChange: (page, pageSize) => this.getMonitorList([], page),
            onShowSizeChange: (current, size) => this.changePageSize(current, size)
        }
    }

    // 切换类型
    onTabChange(key) {
        let searchData = this.state.searchData;
        searchData.type = key;
        this.setState({
            authorizedStatus: key,
            searchData
        }, () => this.getMonitorList([], 1))
    }

    // 弹窗确认
    handleOk() {
        let { editType, allotNum, volunteerId, searchData, authorizedStatus } = this.state;
        let { intl } = this.props;
        if (editType === 'fail') {
            this.noAuditPass()
        } else {
            let { distributeMonitorResult, pageNo, pendingTotal } = this.props;
            // 分配
            if (!volunteerId) {
                message.info(intl.formatMessage({ id: "monitor.please.choose.volunteer", defaultMessage: "请选择志愿者", description: "请选择志愿者" }))
                return
            } else if (!allotNum) {
                message.info('请输入分配任务数量')
                return
            }
            if (allotNum > pendingTotal) {
                message.info('分配任务数量不能大于可分配数量')
                return
            }
            let { monitorId, platformTypeId, ownedBrand, auditStatus, startTime, endTime } = searchData;
            let data = {
                volunteerId: volunteerId,
                allotNum: allotNum,
                monitorId: monitorId,
                platformTypeId: platformTypeId,
                ownedBrand: ownedBrand,
                auditStatus: auditStatus,
                startTime: startTime,
                endTime: endTime,
                type: authorizedStatus
            }
            distributeMonitorResult(data, () => {
                this.setState({
                    volunteerId: undefined,
                    allotNum: '',
                    visible: false
                })
                this.getMonitorList([], pageNo)
            })
        }
    }

    // 不通过
    noAuditPass() {
        let { auditId, reason } = this.state;
        let { monitorResultList, monitorResultAuditStatus } = this.props;
        let auditData = {
            auditStatus: 2,
            id: auditId,
            auditReason: reason
        };
        let auditStatus = getName(monitorResultAuditStatus, auditData.auditStatus)
        auditData.auditStatusName = auditStatus.dictLabel;
        auditData.auditStatusNameEn = auditStatus.dictLabelEn;
        this.props.updateMonitorResultItem(auditData, monitorResultList, () => {
            this.setState({
                reason: '',
                visible: false,
                auditId: ''
            })
        })
    }

    // 显示不通过时提示弹窗
    showConfirm(id) {
        this.setState({
            visible: true,
            editType: 'fail',
            auditId: id
        })
    }

    // 显示自定义导出弹窗
    showExportExcelModal() {
        let result = localStorage.getItem('excelImport');
        let { exportExcelTitle } = this.props;
        if(this.getCondition()){
            if (result) {
                result = JSON.parse(result);
                if (!result.monitorResult) {
                    let autoTitleParam = [];
                    for (let i = 0; i < exportExcelTitle.length; i++) {
                        const element = exportExcelTitle[i];
                        if (element.excelType === 4) {
                            autoTitleParam.push(element.num)
                        }
                    }
                    this.setState({
                        autoTitleParam,
                        visibleExcelExport: true
                    })
                } else {
                    this.setState({
                        autoTitleParam: result.monitorResult,
                        visibleExcelExport: true
                    })
                }
            } else if (!result) {
                let autoTitleParam = [];
                for (let i = 0; i < exportExcelTitle.length; i++) {
                    const element = exportExcelTitle[i];
                    if (element.excelType === 4) {
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
        result.monitorResult = data.autoTitleParam;
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
        let { saveExcelData, brandList, platfromList, monitorResultAuditStatus, prodList } = this.props;
        let queryParamStr = [];
        if (searchData.monitorId) {
            queryParamStr.push(`规则ID:${searchData.monitorId}`)
        }
        if (searchData.ownedBrand) {
            let ownedBrand = getName(brandList, searchData.ownedBrand, 'brand');
            queryParamStr.push(`所属品牌:${ownedBrand.name}`)
        }
        if (searchData.platformTypeId) {
            let platformType = getName(platfromList, searchData.platformTypeId);
            queryParamStr.push(`商品来源:${platformType.dictLabel}`)
        }
        if (searchData.auditStatus) {
            let auditStatus = getName(monitorResultAuditStatus, searchData.auditStatus);
            queryParamStr.push(`状态:${auditStatus.dictLabel}`)
        }
        if (searchData.startTime) {
            queryParamStr.push(`开始时间:${searchData.startTime}`)
        }
        if (searchData.endTime) {
            queryParamStr.push(`截止时间:${searchData.endTime}`)
        }
        if (searchData.queryUrl) {
            queryParamStr.push(`商品链接:${searchData.queryUrl}`)
        }
        if (searchData.prodTypeId) {
            let prodType = getName(prodList, searchData.prodTypeId, 'prod');
            queryParamStr.push(`商品类别:${prodType.name}`)
        }
        let result = Object.assign({}, searchData);
        result.queryUrl = encodeURIComponent(searchData.queryUrl);
        let data = {
            type: 1,
            excelType: 4,
            queryParam: JSON.stringify(result),
            queryParamStr: queryParamStr.toString(),
            autoTitleParam: autoTitleParam.toString(),
            autoPageNum,
            tbName
        }
        saveExcelData(data)
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
            selectedRowKeys = [],
            selectedRow = [],
            chooseTotal = 0,
            chooseCount = 0;
        if (checked) {
            allData = 'all';
            let { monitorResultList, getAllWaitCount } = this.props;
            let { searchData } = this.state;
            // 请求后台
            let data = Object.assign({}, searchData);
            delete data.auditStatus;
            data.monitorId = data.monitorId.trim();
            if (!data.monitorId) {
                message.info('请输入监控规则ID, 查询数据后操作');
                return;
            }
            if (getAllWaitCount) {
                getAllWaitCount(data, (res) => {
                    if (res.success) {
                        if (selectedRowKeys.indexOf('all') === -1) {
                            selectedRowKeys.push('all')
                        }
                        this.setState({
                            chooseCount: res.dataObject,
                            chooseTotal: res.dataObject,
                            selectedRowKeys
                        })
                    }
                })
            }
            for (let i = 0; i < monitorResultList.length; i++) {
                const element = monitorResultList[i];
                if (selectedRowKeys.indexOf(element.id) === -1 && element.auditStatus === 0) {
                    selectedRowKeys.push(element.id);
                    selectedRow.push(element)
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
            selectedRow,
            excludeIdList: [],
            idList: [],
            allData,
            chooseCount,
            chooseTotal,
            indeterminate: false
        })
    }

    // 选择单项
    selectItem(e, record) {
        /**
         * 首选判断是否是全选状态下
         * 其次判断当前是否选中状态
         * 再次判断当前选择的数据类型
         * 然后根据当前选择的数据类型做对应的增删操作
         */
        let checked = e.target.checked, { allData, selectedRowKeys, selectedRow, excludeIdList, idList, chooseCount, indeterminate, chooseTotal, searchData } = this.state;
        if (allData === 'all') {
            if (checked) {
                chooseCount += 1;
                excludeIdList.splice(excludeIdList.indexOf(record.id), 1)
                if (selectedRowKeys.indexOf(record.id) === -1) {
                    selectedRowKeys.push(record.id)
                    selectedRow.push(record)
                }
            } else {
                chooseCount -= 1;
                if (excludeIdList.indexOf(record.id) === -1) {
                    excludeIdList.push(record.id)
                }
                selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
                selectedRow.splice(selectedRow.indexOf(record), 1)
            }
        } else {
            allData = 'item'
            if (checked) {
                chooseCount += 1;
                if (idList.indexOf(record) === -1) {
                    idList.push(record)
                }
                if (idList.length) {
                    let monitorId = idList[0].monitorId;
                    for (let i = 0; i < idList.length; i++) {
                        const element = idList[i];
                        if (element.monitorId !== monitorId) {
                            message.info('请选择同一规则下的数据');
                            idList.splice(idList.indexOf(record), 1)
                            return;
                        }
                    }
                }
                if (selectedRowKeys.indexOf(record.id) === -1) {
                    selectedRowKeys.push(record.id)
                    selectedRow.push(record)
                }
                excludeIdList.splice(excludeIdList.indexOf(record.id), 1)
            } else {
                chooseCount -= 1;
                idList.splice(idList.indexOf(record), 1)
                selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
                selectedRow.splice(selectedRow.indexOf(record), 1)
            }
        }
        if (chooseTotal === chooseCount && chooseTotal !== 0) {
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
            idList,
            excludeIdList,
            selectedRowKeys,
            selectedRow,
            allData,
            chooseCount,
            indeterminate
        })
    }

    handlePass() {
        if (this.getCondition()) {
            let { excludeIdList, idList, allData, searchData, chooseCount, selectedRow } = this.state;
            let { monitorResultList } = this.props;
            let path = `/monitor/result/audit?allData=${allData}&chooseCount=${chooseCount}`;
            if (allData === 'all') {
                if (searchData.monitorId) {
                    path += `&monitorId=${searchData.monitorId}`;
                } else {
                    message.info('请输入监控规则ID, 查询数据后操作');
                    return;
                }
                if (excludeIdList.length) {
                    path += `&excludeIdList=${excludeIdList.toString()}`;
                }
                if (searchData.platformTypeId) {
                    path += `&platformTypeId=${searchData.platformTypeId}`;
                }
                if (searchData.ownedBrand) {
                    path += `&ownedBrand=${searchData.ownedBrand}`;
                } else if (selectedRow.length) {
                    path += `&ownedBrand=${selectedRow[0].ownedBrand}`;
                } else if (monitorResultList.length) {
                    path += `&ownedBrand=${monitorResultList[0].ownedBrand}`;
                }
                if (searchData.prodTypeId) {
                    path += `&prodTypeId=${searchData.prodTypeId}`;
                }
                if (searchData.queryUrl) {
                    path += `&queryUrl=${encodeURIComponent(searchData.queryUrl)}`;
                }
                if (searchData.startTime) {
                    path += `&startTime=${searchData.startTime}`;
                }
                if (searchData.endTime) {
                    path += `&endTime=${searchData.endTime}`;
                }
                if (searchData.type) {
                    path += `&type=${searchData.type}`;
                }
            } else {
                let result = [];
                if (idList.length) {
                    for (let i = 0; i < idList.length; i++) {
                        const element = idList[i];
                        result.push(element.id);
                    }
                    path += `&monitorId=${idList[0].monitorId}`
                    path += `&ownedBrand=${idList[0].ownedBrand}`
                    path += `&platformTypeId=${idList[0].platformTypeId}`
                    path += `&idList=${result.toString()}`;
                } else {
                    message.info('请选择审核的数据');
                    return;
                }
            }
            let { history } = this.props;
            history.push(path)
        }
    }

    // 渲染店铺等级
    renderStoreLevel(item) {
        let icon = '';
        if (item >= 4 && item <= 10) {
            icon = <span><img src={xin} alt="心" /></span>
        } else if (item >= 11 && item <= 40) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 41 && item <= 90) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 91 && item <= 150) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 151 && item <= 250) {
            icon = <span><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /><img src={xin} alt="心" /></span>
        } else if (item >= 251 && item <= 500) {
            icon = <span><img src={zuan} alt="钻" /></span>
        } else if (item >= 501 && item <= 1000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 1001 && item <= 2000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 2001 && item <= 5000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 5001 && item <= 10000) {
            icon = <span><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /><img src={zuan} alt="钻" /></span>
        } else if (item >= 10001 && item <= 20000) {
            icon = <span><img src={guan} alt="皇冠" /></span>
        } else if (item >= 20001 && item <= 50000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 50001 && item <= 100000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 100001 && item <= 200000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 200001 && item <= 500000) {
            icon = <span><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /><img src={guan} alt="皇冠" /></span>
        } else if (item >= 500001 && item <= 1000000) {
            icon = <span><img src={hg} alt="金冠" /></span>
        } else if (item >= 1000001 && item <= 2000000) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        } else if (item >= 2000001 && item <= 5000000) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        } else if (item >= 5000001 && item <= 10000000) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        } else if (item > 10000001) {
            icon = <span><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /><img src={hg} alt="金冠" /></span>
        }
        return icon;
    }

    handelCancel() {
        let { editType } = this.state;
        if (editType === 'fail') {
            this.setState({
                reason: '',
                visible: false
            })
        } else {
            this.setState({
                volunteerId: undefined,
                allotNum: '',
                visible: false
            })
        }
    }

    // 显示分配弹窗
    distributionTask() {
        let { searchData, authorizedStatus, pageSize } = this.state;
        let { pageNo, queryMonitorPendingCount } = this.props;
        let data = Object.assign({}, searchData);
        data.pageSize = pageSize;
        data.pageNo = pageNo;
        data.type = authorizedStatus;
        if (queryMonitorPendingCount) {
            queryMonitorPendingCount(searchData)
        }
        this.setState({
            visible: true,
            editType: 'distribution'
        })
    }

    // 修改分配信息
    changeTaskAllocation(value, key) {
        if (key === 'allotNum') {
            const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
            if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
                this.setState({
                    [key]: value
                })
            }
        } else {
            this.setState({
                [key]: value
            })
        }
    }

    // 查找志愿者
    serachVolunteer(value) {
        let { searchFetch, getVolunteerList } = this.props;
        if (!searchFetch) {
            if (getVolunteerList) {
                getVolunteerList({ nameOrMobile: value })
            }
        }
    }

    cancelDistribute(id) {
        let { monitorResultAuditStatus, cancelDistributeMonitorResult, monitorResultList } = this.props;
        let auditStatus = getName(monitorResultAuditStatus, 0)
        let data = {
            id: id,
            auditStatus: 0,
            auditStatusName: auditStatus.dictLabel,
            auditStatusNameEn: auditStatus.dictLabelEn
        }
        cancelDistributeMonitorResult(data, monitorResultList)
    }

    renderOpearte(text, item) {
        let { permissionList } = this.props;
        if (item.auditStatus === 0 && getButtonPrem(permissionList, '005002002') && item.isHide !== 10) {
            return (
                <div>
                    <Link to={`/monitor/result/audit?resultId=${item.id}&ownedBrand=${item.ownedBrand}&platformTypeId=${item.platformTypeId}&prodUrl=${encodeURIComponent(item.url)}`}>
                        <FormattedMessage id="global.pass" defaultMessage="通过" description="通过" />
                    </Link>
                    <br />
                    <a onClick={() => this.showConfirm(item.id)}>
                        <FormattedMessage id="global.fail" defaultMessage="不通过" description="不通过" />
                    </a>
                </div>
            )
        } else if (item.auditStatus === 3 && getButtonPrem(permissionList, '005002004') && item.isHide !== 10) {
            return (
                <div>
                    <a onClick={() => this.cancelDistribute(item.id)}>
                        <FormattedMessage id="monitor.cancel.distribution" defaultMessage="取消分配" description="取消分配" />
                    </a>
                </div>
            )
        }
    }

    // 创建配置行
    createColumns() {
        let { intl } = this.props;
        let { indeterminate } = this.state;
        const columns = [
            {
                title: <Checkbox value='all' indeterminate={indeterminate} onChange={e => this.selectAll(e)} />,
                width: '5%',
                dataIndex: 'id',
                key: 'checkbox',
                render: (text, item) => <Checkbox value={text} disabled={item.auditStatus !== 0 || item.isHide === 10} onChange={e => this.selectItem(e, item)} />
            }, {
                title: <FormattedMessage id="monitor.source" defaultMessage="来源" description="来源" />,
                key: 'monitorId',
                width: '22%',
                render: (text, item) => (
                    <div className="table-info">
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="monitor.monitoring.id" defaultMessage="监控ID" description="监控ID" />: {item.monitorId}
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="monitor.monitor.name" defaultMessage="监控名称" description="监控名称" />: {item.monitorName}
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="monitor.picture.rule.brand" defaultMessage="所属品牌" description="所属品牌" />: {item.brandName}
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="global.platform" defaultMessage="平台" description="平台" />:
                            {
                                    intl.locale === 'en'
                                        ? item.platformNameEn
                                        : item.platformName
                                }
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="monitor.climb.time" defaultMessage="爬取时间" description="爬取时间" />: {item.crawleTime}
                            </span>
                        </p>
                    </div>
                )
            }, {
                title: <FormattedMessage id="monitor.commodity.information" defaultMessage="商品信息" description="商品信息" />,
                key: 'monitorName',
                width: '35%',
                render: (text, item) => (
                    <div className="table-info">
                        <p className="table-item">
                            <span className="table-item-span table-item-span table-item-w100">
                                {
                                    item.title
                                        ? <a href={item.url} target='_blank'>{item.title}</a>
                                        : <a href={item.url} target='_blank'>{item.url}</a>
                                }
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w50">
                                <FormattedMessage id="monitor.price" defaultMessage="价格" description="价格" />: {item.price}
                            </span>
                            <span className="table-item-span table-item-w50">
                                <FormattedMessage id="monitor.inventory" defaultMessage="库存" description="库存" />: {item.totalQuantity}
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w50">
                                <FormattedMessage id="monitor.thirty.days.sales" defaultMessage="30天销量" description="30天销量" />: {item.salesVolume}
                            </span>
                            <span className="table-item-span table-item-w50">
                                <FormattedMessage id="monitor.evaluation" defaultMessage="评价" description="评价" />: {item.evaluate}
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w50">
                                <FormattedMessage id="monitor.seller.id" defaultMessage="卖家ID" description="卖家ID" />: {item.sellerNick}
                            </span>
                            <span className="table-item-span table-item-w50">
                                <FormattedMessage id="monitor.storeName" defaultMessage="店铺名称" description="店铺名称" />: {item.storeName}
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w50">
                                <FormattedMessage id="monitor.store.grade" defaultMessage="店铺等级" description="店铺等级" />: {this.renderStoreLevel(item.storeLevel)}
                            </span>
                            <span className="table-item-span table-item-w50">
                                <FormattedMessage id="monitor.brand.information" defaultMessage="品牌信息" description="品牌信息" />: {item.brand}
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w50">
                                <FormattedMessage id="monitor.address" defaultMessage="发货地" description="发货地" />: {item.consignmentPlace}
                            </span>
                        </p>                        
                        <div className="table-item tabel-img-wrap">
                            <span className="item-label-span item-label-span">
                                <FormattedMessage id="monitor.master.plan" defaultMessage="商品主图" description="商品主图" />: 
                            </span>
                            <div className="tabel-img-info">
                                {
                                    item.picUrl ? item.picUrl.split(',').map((img,key) => (
                                        <span className="tabel-img-item" key={key} onClick={() => this.setState({ visibleImg: true, showImg: img ? img.replace('/_', '/') : '' })}>
                                            <img className="tabel-img" src={img} alt="商品主图"/>
                                        </span>                                            
                                    )) : ''
                                }
                            </div>
                        </div>
                    </div>
                )
            }, {
                title: <FormattedMessage id="monitor.tort.information" defaultMessage="侵权信息" description="侵权信息" />,
                key: 'brand',
                width: '15%',
                render: (text, item) => (
                    <div className="table-info">
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="monitor.tort.brand" defaultMessage="侵权品牌" description="侵权品牌" />: {item.brandName}
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <FormattedMessage id="monitor.tort.type" defaultMessage="侵权类型" description="侵权类型" />:
                            {
                                    intl.locale === 'en'
                                        ? item.reportTypeNameEn
                                        : item.reportTypeName
                                }
                            </span>
                        </p>
                        <p className="table-item">
                            <span className="table-item-span table-item-w100">
                                <span className="table-lable">
                                    <FormattedMessage id="monitor.product.classification" defaultMessage="产品分类" description="产品分类" />:
                            </span>
                                <span className="table-tip">
                                    <Tooltip placement="topLeft" title={intl.locale === 'en' ? item.prodCategoryNameEn : item.prodCategoryName} >
                                        {
                                            intl.locale === 'en'
                                                ? item.prodCategoryNameEn
                                                : item.prodCategoryName
                                        }
                                    </Tooltip>
                                </span>
                            </span>
                        </p>
                    </div>
                )
            }, {
                title: <FormattedMessage id="global.status" defaultMessage="状态" description="状态" />,
                dataIndex: 'auditStatus',
                key: 'auditStatus',
                width: '14%',
                render: (text, item) => {
                    return (
                        <div>
                            {
                                item.whiteType !== '' && item.whiteType > 0
                                    ? <p style={{ color: 'red', marginBottom: 0 }}><FormattedMessage id="monitor.licensed" defaultMessage="已授权" description="已授权" /></p>
                                    : ''
                            }
                            {
                                item.isHide === 10
                                    ? <p style={{ color: 'red', marginBottom: 0 }}><FormattedMessage id="global.deleted" defaultMessage="已删除" description="已删除" /></p>
                                    : ''
                            }
                            {
                                intl.locale === 'en'
                                    ? item.auditStatusNameEn
                                    : item.auditStatusName
                            }
                            {
                            	( item.auditStatus === 2  || item.auditStatus === 10 || item.auditStatus === 5 || item.auditStatus === 7 ) && item.auditReason ? <p>( {item.auditReason} )</p> : ''
                        	}
                        </div>
                    )
                }
            }, {
                title: <FormattedMessage id="global.operate" defaultMessage="操作" description="操作" />,
                dataIndex: 'auditStatus',
                key: 'id',
                width: '14%',
                render: (text, item) => this.renderOpearte(text, item)
            }
        ];
        return columns;
    }

    render() {
        let {
            intl, total, pageNo, monitorResultList, brandList,
            volunteerList, isFetch, permissionList, pendingTotal, monitorResultAuditStatus,
            platfromList, exportExcelTitle, prodList
        } = this.props;
        let {
            ownedBrand, monitorId, pageSize, visible, platformTypeId,
            auditStatus, allotNum, volunteerId, reason, editType,
            queryUrl, visibleExcelExport, autoTitleParam, tbName, prodTypeId,
            selectedRowKeys, chooseCount, visibleImg, showImg
        } = this.state;
        let breadcrumbData = [
            { link: '/', titleId: 'router.home', title: '首页' },
            { link: '', titleId: 'router.data.monitoring', title: '数据监测管理' },
            { link: '', titleId: 'router.monitoring.rlue.check', title: '数据监控结果' }
        ]
        const tabListNoTitle = [
            {
                key: '1',
                tab: <FormattedMessage id="global.all" defaultMessage="全部" description="全部" />
            },
            {
                key: '2',
                tab: <FormattedMessage id="monitor.unauthorized.goods" defaultMessage="未授权商品" description="未授权商品" />
            },
            {
                key: '3',
                tab: <FormattedMessage id="monitor.licensed.product" defaultMessage="已授权商品" description="已授权商品" />
            },
            {
                key: '4',
                tab: <FormattedMessage id="monitor.off.shelves.product" defaultMessage="已删除商品" description="已删除商品" />
            }
        ]
        return (
            <Content className="monitor-result" breadcrumbData={breadcrumbData}>
                <div className="search-form">
                    <Row>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "monitor.rule.id", defaultMessage: "规则ID", description: "规则ID" })}>
                                <InputNumber
                                    placeholder={intl.formatMessage({ id: "monitor.please.enter.the.monitoring.rule.ID", defaultMessage: "请输入监控规则ID", description: "请输入监控规则ID" })}
                                    value={monitorId}
                                    onChange={value => this.handleChange(value, 'monitorId')}
                                    onPressEnter={(e) => this.handleSearch()}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "monitor.picture.rule.brand", defaultMessage: "所属品牌", description: "所属品牌" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "monitor.picture.rule.choose.brand", defaultMessage: "请选择所属品牌", description: "请选择所属品牌" })}
                                    value={ownedBrand}
                                    onChange={(value) => this.handleChange(value, 'ownedBrand')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        brandList && brandList.filter(item => item.isDelete === 0)
                                            .map(opt => <Option key={opt.id} value={opt.id}>{opt.name}</Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "monitor.commodity.source", defaultMessage: "商品来源", description: "商品来源" })}>
                                <Select
                                    placeholder={intl.formatMessage({ id: "monitor.please.select.the.source.of.the.product", defaultMessage: "请选择商品来源", description: "请选择商品来源" })}
                                    value={platformTypeId}
                                    onChange={(value) => this.handleChange(value, 'platformTypeId')}
                                    dropdownMatchSelectWidth={true}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        platfromList && platfromList.filter(item => item.isDel === 0)
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
                            <FormItem label={intl.formatMessage({ id: "global.status", defaultMessage: "状态", description: "状态" })}>
                                <Select
                                    value={auditStatus}
                                    dropdownMatchSelectWidth={false}
                                    onChange={(value) => this.handleChange(value, 'auditStatus')}
                                    placeholder={intl.formatMessage({ id: "global.please.select.status", defaultMessage: "请选择状态", description: "请选择状态" })}
                                    showSearch
                                    filterOption={(input, option) => option.props.value === '' ? false : option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=""><FormattedMessage id="global.all" defaultMessage="全部" description="全部" /></Option>
                                    {
                                        monitorResultAuditStatus && monitorResultAuditStatus.filter(item => item.isDel === 0)
                                            .map(opt => <Option value={opt.dictVal} key={opt.dictVal}>{intl.locale === 'en' ? opt.dictLabelEn : opt.dictLabel}</Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "global.start.time", defaultMessage: "开始时间", description: "开始时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'startTime')} value={this.state.startDate} />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "global.end.time", defaultMessage: "截止时间", description: "截止时间" })}>
                                <DatePicker onChange={(date, dateStr) => this.changeDatePicker(date, dateStr, 'endTime')} value={this.state.endDate} />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "global.prod.url", defaultMessage: "商品链接", description: "商品链接" })}>
                                <Input
                                    value={queryUrl}
                                    onPressEnter={(e) => this.handleSearch()}
                                    onChange={e => this.handleChange(e.target.value.trim(), 'queryUrl')}
                                    placeholder={intl.formatMessage({ id: "global.please.enter.prod.url", defaultMessage: "请输入商品链接", description: "请输入商品链接" })}
                                />
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label={intl.formatMessage({ id: "report.category", defaultMessage: "商品类别", description: "商品类别" })}>
                                <Select
                                    showSearch
                                    value={prodTypeId}
                                    dropdownMatchSelectWidth={false}
                                    onChange={(e) => this.handleChange(e, 'prodTypeId')}
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
                            getButtonPrem(permissionList, '005002004')
                                ? <Button type="primary" onClick={() => this.distributionTask()}>
                                    <FormattedMessage id="global.distribution" defaultMessage="分配" description="分配" />
                                </Button>
                                : ''
                        }
                        {
                            getButtonPrem(permissionList, '005002003')
                                ? <Button onClick={() => this.showExportExcelModal()}>
                                    <FormattedMessage id="global.export" defaultMessage="导出" description="导出" />
                                </Button>
                                : ''
                        }
                        {
                            getButtonPrem(permissionList, '005002002')
                                ? <Button onClick={() => this.handlePass()}>
                                    <FormattedMessage id="monitor.batch.through" defaultMessage="批量通过" description="批量通过" />
                                </Button>
                                : ''
                        }
                    </Col>
                </Row>
                <Alert
                    message={intl.formatMessage({ id: "brand.a.total.of.data.in.the.interface", defaultMessage: `界面共（${total === undefined ? '0' : total}）条数据，已选择 (${{ chooseCount: chooseCount }}) 条数据`, description: `界面共（100）条数据` }, { count: total, chooseCount: chooseCount })}
                    type="info"
                    showIcon
                    className="Alert_info"
                />
                <Card
                    tabList={tabListNoTitle}
                    activeTabKey={this.state.authorizedStatus}
                    onTabChange={(key) => { this.onTabChange(key) }}
                >
                    <CheckboxGroup value={selectedRowKeys} style={{ width: '100%' }}>
                        <Table
                            dataSource={monitorResultList}
                            columns={this.createColumns()}
                            pagination={false}
                            rowKey="id"
                            loading={isFetch}
                        />
                    </CheckboxGroup>
                </Card>
                <Pagination
                    onChange={(page) => this.getMonitorList([], page)}
                    total={total}
                    current={pageNo}
                    pageSize={pageSize}
                    showQuickJumper
                    showSizeChanger
                    onShowSizeChange={(current, pageSize) => this.changePageSize(pageSize)}
                />
                <Modal
                    title={
                        editType === 'fail'
                            ? intl.formatMessage({ id: "monitor.commodity.audit", defaultMessage: "商品审核", description: "商品审核" })
                            : intl.formatMessage({ id: "monitor.task.allocation", defaultMessage: "任务分配", description: "任务分配" })
                    }
                    visible={visible}
                    onCancel={() => this.handelCancel()}
                    onOk={() => this.handleOk()}
                    className='root monitor-result-modal'
                >
                    <div className='search-form'>
                        {
                            editType === 'fail'
                                ? (
                                    <Row>
                                        <Col span={20} offset={2}>
                                            <FormItem label={intl.formatMessage({ id: "monitor.fail.reason", defaultMessage: "不通过理由", description: "不通过理由" })} >
                                                <Input
                                                    value={reason}
                                                    onChange={e => this.setState({ reason: e.target.value.trim() })}
                                                    placeholder={intl.formatMessage({ id: "monitor.please.enter.fail.reason", defaultMessage: "请输入不通过理由", description: "请输入不通过理由" })}
                                                />
                                            </FormItem>
                                        </Col>
                                    </Row>
                                )
                                : [
                                    <Row key='1-1'>
                                        <Col span={20} offset={2}>
                                            <FormItem label={intl.formatMessage({ id: "users.volunteer", defaultMessage: "志愿者", description: "志愿者" })} >
                                                <Select
                                                    showSearch
                                                    showArrow={false}
                                                    value={volunteerId}
                                                    filterOption={false}
                                                    notFoundContent={null}
                                                    defaultActiveFirstOption={false}
                                                    onSearch={value => this.serachVolunteer(value)}
                                                    onChange={value => this.changeTaskAllocation(value, 'volunteerId')}
                                                    placeholder={intl.formatMessage({ id: "monitor.please.choose.volunteer", defaultMessage: "请选择志愿者", description: "请选择志愿者" })}
                                                >
                                                    {
                                                        volunteerList && volunteerList.filter(item => item.isDelete === 0)
                                                            .map(opt =>
                                                                <Option value={opt.userId} className='search-opt' key={opt.userId}>
                                                                    <div className='search-opt-wrap'>
                                                                        <div className="opt-name">
                                                                            {opt.name ? opt.userName : opt.mobile}
                                                                        </div>
                                                                        <div className="opt-pending">
                                                                            <FormattedMessage id="global.pending" defaultMessage="待审核" description="待审核" />:
                                                                            {opt.waitAuditCount}
                                                                        </div>
                                                                    </div>
                                                                </Option>
                                                            )
                                                    }
                                                </Select>
                                            </FormItem>
                                        </Col>
                                    </Row>,
                                    <Row key='1-2'>
                                        <Col span={20} offset={2}>
                                            <FormItem label={intl.formatMessage({ id: "monitor.allocation.numbers", defaultMessage: "分配数量", description: "分配数量" })} >
                                                <InputGroup compact>
                                                    <InputNumber
                                                        style={{ width: '50%' }}
                                                        value={allotNum}
                                                        onChange={value => this.changeTaskAllocation(value, 'allotNum')}
                                                        placeholder={intl.formatMessage({ id: "monitor.please.enter.allocation.numbers", defaultMessage: "请输入分配数量", description: "请输入分配数量" })}
                                                    />
                                                    <Input style={{ width: '50%' }} disabled value={pendingTotal} />
                                                </InputGroup>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                ]
                        }
                    </div>
                </Modal>
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
				<PictureModal
					onCancel={() => this.setState({ visibleImg: false })}
					visible={visibleImg}
					showImg={showImg}
				/>
            </Content>
        )
    }
}

