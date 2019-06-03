import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import ReportBaseList from './index'
import { GET_REPORT_BASE_LIST_SUCCESS, UPDATE_REPORT_BASE_LIST_SUCCESS, UPDATE_REPORT_BASE_LIST_ERROR } from '../../../contants/report/volunteerReportTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'
import { message } from 'antd';
import { GET_REPORT_REASON_QUERY_LIST_SUCCESS, GET_TRADEMARK_QUERY_LIST_SUCCESS } from '../../../contants/commonTypes';

function mapStateToProps(state, ownProps) {
    const { 
        brandList, platfromList, permissionList,reportConfirmationStatus, reportType, 
        reportResourceType, reportReasonQueryList, tardemarkQueryList, prodList, exportExcelTitle, 
        volunteerReportStatisticStatus 
    } = state.commonReducer;
    const { 
        isFetch, oldReportBaseList, newReportBaseList, searchData: baseSearchData, pageNo, 
        total
    } = state.volunteerReportBaseReducer;
    const { searchData } = state.volunteerReportReducer;
    const reportList = union(oldReportBaseList, newReportBaseList);
    return {
        reportList,
        isFetch,
        pageNo, 
        total, 
        brandList,
        platfromList,
        permissionList,
        reportConfirmationStatus,
        reportType,
        baseSearchData,
        reportResourceType,
        reportReasonQueryList,
        tardemarkQueryList,
        prodList,
        exportExcelTitle,
        searchData,
        volunteerReportStatisticStatus
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        getReportList: (oldReportBaseList, data) => {
            dispatch(actionCreator(GET_REPORT_BASE_LIST_SUCCESS, { isFetch: true, searchData: data }))
            Api.reportPage(data).then(res => {
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
                dispatch(actionCreator(GET_REPORT_BASE_LIST_SUCCESS, { oldReportBaseList, newReportBaseList: res.result || [], total: res.records || 0, pageNo: data.pageNo, isFetch: false, searchData: data }))
                
            })
        },
        saveExcelData: (data) => {
            Api.volunteerRepoerExport(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                } else {
                    message.error(res.msg)
                }
            })
        },
        //获取全选的待审核量
        getVolunteerRepoerCount: (data,callback) => {
            Api.getVolunteerRepoerCount(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback(res)
                }
            })
        },
        //批量审核
        updateVolunteerReportByIdList: (data, oldReportBaseList, callback, callback2) => {
            Api.volunteerReportByIdList(data).then((res) => {
                let reload = false;
                if(res.success ) {
                    let newReportBaseList = [];
                    //picIdList   tradeIdList    exculdPicIdList   exculdTradeIdList
                    //不点全选
                    if ( data.chooseCount && data.selectedRowKeys.length && oldReportBaseList.length && data.chooseCount === res.dataObject ) {
                        for (let i = 0; i < oldReportBaseList.length; i++) {
                            const oldItem = oldReportBaseList[i];
                            for (let j = 0; j < data.selectedRowKeys.length; j++) {
                                const element = data.selectedRowKeys[j];
                                if (element == oldItem.id) {
                                    oldItem.auditStatus = data.auditStatusAfter;
                                    oldItem.auditReason = data.auditReason;
                                    oldItem.rejectReason = data.auditReason;
                                    oldItem.auditStatusName = data.auditStatusName
                                    oldItem.auditStatusNameEn = data.auditStatusNameEn
                                    oldItem.reportMgrAuditTime = data.SendTime
                                }
                            }
                            newReportBaseList.push(oldItem)
                        }
                        dispatch(actionCreator(UPDATE_REPORT_BASE_LIST_SUCCESS, { newReportBaseList: newReportBaseList }))
                        reload = false;
                    } else {
                        //全选
                        reload = true;
                    }
                    message.info(`共${data.chooseCount}条数据，成功处理${res.dataObject}条，${data.chooseCount - res.dataObject + '条失败'}`)
                } else {
                    dispatch(actionCreator(UPDATE_REPORT_BASE_LIST_SUCCESS, { newReportBaseList: oldReportBaseList }))
                    reload = false;
                    message.info(res.msgCode)
                }
                typeof callback === 'function' && callback(reload)
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
