import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import ReportBaseList from './index'
import { GET_REPORT_BASE_SCREEN_LIST_SUCCESS, UPDATE_REPORT_BASE_SCREEN_LIST_SUCCESS, UPDATE_REPORT_BASE_SCREEN_LIST_ERROR } from '../../../contants/report/volunteerReportTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'
import { message } from 'antd';
import { GET_REPORT_REASON_QUERY_LIST_SUCCESS, GET_TRADEMARK_QUERY_LIST_SUCCESS } from '../../../contants/commonTypes';

function mapStateToProps(state, ownProps) {
    const { brandList, platfromList, permissionList,reportOperationScreen, reportType, reportResourceType, reportReasonQueryList, tardemarkQueryList, prodList, exportExcelTitle } = state.commonReducer;
    const { 
        isFetch, oldoperationBaseList, newoperationBaseList, pageNo, 
        total,confirmationStatus
    } = state.volunteerReportOperationBaseReducer;
    const { searchData } = state.volunteerscreenReducer;
    const operationBaseList = union(oldoperationBaseList, newoperationBaseList);
    return {
        operationBaseList,
        isFetch,
        pageNo, 
        searchData,
        total,
        brandList,
        platfromList,
        permissionList,
        confirmationStatus,
        reportOperationScreen,
        reportType,
        reportReasonQueryList,
        tardemarkQueryList,
        prodList,
        exportExcelTitle,
        reportResourceType,
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getConfirmationList: (oldoperationBaseList, data) => {
            dispatch(actionCreator(GET_REPORT_BASE_SCREEN_LIST_SUCCESS, { isFetch: true, searchData: data }))
            Api.getFilterPage(data).then(res => {
               if (res.success) {
                    for (let i = 0; i < res.result.length; i++) {
                        const element = res.result[i];
                        if(element.refChannelName && /(\([\s\S]*?\))|(（[\s\S]*?）)$/.test(element.refChannelName) && element.reportType === 1) {
                            let result = element.refChannelName.match(/(\([\s\S]*?\))|(（[\s\S]*?）)$/)[0];
                            element.refChannelUrl = result.replace(/(\(|\)|（|）|\s)/g, '')
                            element.refChannelName = element.refChannelName.substring(0,element.refChannelName.search(/(\(|（)/))
                        }
                        element.refChannelUrl = element.refChannelUrl.replace(/\s/g,'');
                        if(element.refChannelUrl && !(/^(https|http):\/\//.test(element.refChannelUrl))) {
                            element.refChannelUrl = 'http://' + element.refChannelUrl;
                        }
                    }
                }
                dispatch(actionCreator(GET_REPORT_BASE_SCREEN_LIST_SUCCESS, { oldoperationBaseList, newoperationBaseList: res.result || [], total: res.records || 0, pageNo: data.pageNo, isFetch: false, searchData: data }))
                
            })
        },
        //推送
        confirmExamin: (data, oldoperationBaseList, callback, callback2) => {
            Api.volunteerModifyfilter(data).then(res => {
                let reload = false;
                if (res.success) {
                    let newoperationBaseList = [];
                    if (data.itemAudit) {
                        // 单条审核
                        if (res.dataObject !== 0) {
                            for (let i = 0; i < oldoperationBaseList.length; i++) {
                                const element = oldoperationBaseList[i];
                                if (data.itemAudit.id === element.id) {
                                    element.auditStatus = data.auditStatusAfter;
                                    element.auditStatusName = data.auditStatusName
                                    element.auditStatusNameEn = data.auditStatusNameEn
                                    element.filterSendTime = data.SendTime
                                }
                                newoperationBaseList.push(element)
                            }
                            dispatch(actionCreator(UPDATE_REPORT_BASE_SCREEN_LIST_SUCCESS, { newoperationBaseList }))
                            message.info('推送成功')
                        } else {
                            message.info('推送失败')
                        }
                    } else {
                        if (data.chooseCount === res.dataObject && oldoperationBaseList.length && data.selectedRowKeys.length) {
                            for (let i = 0; i < oldoperationBaseList.length; i++) {
                                const oldItem = oldoperationBaseList[i];
                                for (let j = 0; j < data.selectedRowKeys.length; j++) {
                                    const element = data.selectedRowKeys[j];
                                    if (element === oldItem.id) {
                                        oldItem.auditStatus = data.auditStatusAfter;
                                        oldItem.auditStatusName = data.auditStatusName
                                        oldItem.auditStatusNameEn = data.auditStatusNameEn
                                        oldItem.filterSendTime = data.SendTime
                                    }
                                }
                                newoperationBaseList.push(oldItem)
                            }
                            dispatch(actionCreator(UPDATE_REPORT_BASE_SCREEN_LIST_SUCCESS, { newoperationBaseList }))
                            reload = false;
                        } else {
                            reload = true;
                        }
                        message.info(`共${data.chooseCount}条数据，成功处理${res.dataObject}条，${data.chooseCount - res.dataObject + '条失败'}`)
                    }
                } else {
                    dispatch(actionCreator(UPDATE_REPORT_BASE_SCREEN_LIST_ERROR, { oldoperationBaseList }))
                    reload = false;
                    message.error(res.msg)
                }
                typeof callback === 'function' && callback(reload)
            })
        },
        //导入
        saveExcelData: (data) => {
            Api.createExportExcel(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                } else {
                    message.error(res.msg)
                }
            })
        },
        //导出
        saveExportData: (data) => {
            Api.getFilterExport(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                } else {
                    message.error(res.msg)
                }
            })
        },
        //获取count
        getConfirmCount: (data, callback) => {
            Api.getFilterCount(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback(res)
                }
            })
        },
        getReportReasonQueryList: data => {
            Api.getReportReasonQueryList(data).then(res => {
                dispatch(actionCreator(GET_REPORT_REASON_QUERY_LIST_SUCCESS, { reportReasonQueryList: res.dataObject }))
            })
        },
        getTrademarkQueryList: data => {
            Api.getTrademarkQueryList(data).then(res => {
                dispatch(actionCreator(GET_TRADEMARK_QUERY_LIST_SUCCESS, { tardemarkQueryList: res.dataObject }))
            })
        },
        getExportExcelTitle: data => {
            Api.queryExcelTitle(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_EXPORT_EXCEL_TITLE_SUCCESS, { exportExcelTitle: res.dataObject }))
                } else {
                    dispatch(actionCreator(GET_EXPORT_EXCEL_TITLE_SUCCESS, { exportExcelTitle: [] }))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ReportBaseList))
