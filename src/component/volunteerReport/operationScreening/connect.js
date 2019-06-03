import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import OperationScreening from './index'
import { GET_VOLUNTEER_SCREEN_LIST_SUCCESS, UPDATE_VOLUNTEER_SCREEN_SUCCESS, UPDATE_VOLUNTEER_SCREEN_ERROR, GET_VOLUNTEER_SCREEN_STORE_LIST_SUCCESS } from '../../../contants/report/volunteercreeningTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import { actionCreator, union } from '../../../utils/util'
import Api from '../../../api/index'
import { message } from 'antd';
import { GET_REPORT_REASON_QUERY_LIST_SUCCESS, GET_TRADEMARK_QUERY_LIST_SUCCESS } from '../../../contants/commonTypes';

function mapStateToProps(state, props) {
    const { brandList, platfromList, permissionList, confirmationStatus, reportOperationScreen, reportType, reportReasonQueryList, tardemarkQueryList, prodList, exportExcelTitle, reportResourceType } = state.commonReducer;
    const { userInfo } = state.loginReducer;
    const { isFetch, searchData, oldVolunteerScreen, newVolunteerScreen, pageNo, total = 0, oldVolunteerScreenStoreList, 
        newVolunteerScreenStoreList, storePageNo, storeTotal = 0  } = state.volunteerscreenReducer;
    const volunteerScreen = union(oldVolunteerScreen, newVolunteerScreen)
    const volunteerStoreScreen = union(oldVolunteerScreenStoreList, newVolunteerScreenStoreList)
    return {
        volunteerScreen,
        volunteerStoreScreen,
        searchData,
        isFetch,
        pageNo,
        total,
        userInfo,
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
        storePageNo,
        storeTotal
    }
}
function mapDispatchToProps(dispatch, props) {
    return {
        //获取列表
        getConfirmationList: (data, oldVolunteerScreen) => {
            dispatch(actionCreator(GET_VOLUNTEER_SCREEN_LIST_SUCCESS, { isFetch: true }))
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
                dispatch(actionCreator(GET_VOLUNTEER_SCREEN_LIST_SUCCESS, { oldVolunteerScreen, newVolunteerScreen: res.result || [], total: res.records || 0, pageNo: data.pageNo, isFetch: false, searchData: data  }))
            })
        },
        //获取店铺
        getFilterStorePage: (oldVolunteerScreenStoreList, data) => {
            Api.getFilterStorePage(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_VOLUNTEER_SCREEN_STORE_LIST_SUCCESS, { oldVolunteerScreenStoreList: oldVolunteerScreenStoreList, newVolunteerScreenStoreList: res.result || [], storePageNo: data.pageNo, storeTotal: res.records }))
                } else {
                    dispatch(actionCreator(GET_VOLUNTEER_SCREEN_STORE_LIST_SUCCESS, { oldVolunteerScreenStoreList: oldVolunteerScreenStoreList, newVolunteerScreenStoreList: [], storePageNo: data.pageNo - 1 , storeTotal: 0 }))
                }
            })
        },
        //推送
        confirmExamin: (data, oldVolunteerScreen, callback, callback2) => {
            Api.volunteerModifyfilter(data).then(res => {
                let reload = false;
                if (res.success) {
                    let newVolunteerScreen = [];
                    if (data.itemAudit) {
                        // 单条审核
                        if (res.dataObject !== 0) {
                            for (let i = 0; i < oldVolunteerScreen.length; i++) {
                                const element = oldVolunteerScreen[i];
                                if (data.itemAudit.id === element.id) {
                                    element.auditStatus = data.auditStatusAfter;
                                    element.auditStatusName = data.auditStatusName
                                    element.auditStatusNameEn = data.auditStatusNameEn
                                    element.filterSendTime = data.SendTime
                                }
                                newVolunteerScreen.push(element)
                            }
                            dispatch(actionCreator(UPDATE_VOLUNTEER_SCREEN_SUCCESS, { newVolunteerScreen }))
                            message.info('推送成功')
                        } else {
                            message.info('推送失败')
                        }
                    } else {
                        if (data.chooseCount === res.dataObject && oldVolunteerScreen.length && data.selectedRowKeys.length) {
                            for (let i = 0; i < oldVolunteerScreen.length; i++) {
                                const oldItem = oldVolunteerScreen[i];
                                for (let j = 0; j < data.selectedRowKeys.length; j++) {
                                    const element = data.selectedRowKeys[j];
                                    if (element === oldItem.id) {
                                        oldItem.auditStatus = data.auditStatusAfter;
                                        oldItem.auditStatusName = data.auditStatusName
                                        oldItem.auditStatusNameEn = data.auditStatusNameEn
                                        oldItem.filterSendTime = data.SendTime
                                    }
                                }
                                newVolunteerScreen.push(oldItem)
                            }
                            dispatch(actionCreator(UPDATE_VOLUNTEER_SCREEN_SUCCESS, { newVolunteerScreen }))
                            reload = false;
                        } else {
                            reload = true;
                        }
                        message.info(`共${data.chooseCount}条数据，成功处理${res.dataObject}条，${data.chooseCount - res.dataObject + '条失败'}`)
                    }
                } else {
                    dispatch(actionCreator(UPDATE_VOLUNTEER_SCREEN_ERROR, { oldVolunteerScreen }))
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OperationScreening))
