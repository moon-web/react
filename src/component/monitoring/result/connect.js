import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { message } from 'antd'
import MonitorResultList from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_MONITOR_RESULT_LIST_SUCCESS, UPDATE_MONITOR_RESULT_STATUS_SUCCESS, UPDATE_MONITOR_RESULT_STATUS_ERROR, GET_VOLUNTEER_LIST_SUCCESS, GET_VOLUNTEER_LIST_ERROR, GET_MONITOR_RESULT_PENDING_COUNT } from '../../../contants/monitoring/monitorResultListTypes'
import { GET_EXPORT_EXCEL_TITLE_SUCCESS } from '../../../contants/commonTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { isFetch, oldMonitorResultList, newMonitorResultList, pageNo = 1, total, searchData, volunteerList, pendingTotal, searchFetch } = state.monitorResultListReducer;
    const monitorResultList = union(oldMonitorResultList, newMonitorResultList)
    const { brandList, platfromList, prodList, infringementList, permissionList, monitorResultAuditStatus, exportExcelTitle } = state.commonReducer;
    return {
        isFetch,
        monitorResultList,
        pageNo,
        total,
        brandList,
        platfromList,
        prodList,
        infringementList,
        monitorResultAuditStatus,
        permissionList,
        searchData,
        volunteerList,
        pendingTotal,
        searchFetch,
        exportExcelTitle
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        // 获取列表
        getMonitorList: (oldMonitorResultList, data) => {
            dispatch(actionCreator(GET_MONITOR_RESULT_LIST_SUCCESS, { isFetch: true }))
            Api.monitorlist(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_MONITOR_RESULT_LIST_SUCCESS, { oldMonitorResultList, newMonitorResultList: res.result || [], pageNo: data.pageNo, total: res.records, isFetch: false, searchData: data }))
                } else {
                    dispatch(actionCreator(GET_MONITOR_RESULT_LIST_SUCCESS, { oldMonitorResultList, newMonitorResultList: [], pageNo: 1, total: 0, isFetch: false }))
                    message.info(res.msg)
                }
            })
        },
        // 更新列表数据
        updateMonitorResultItem: (data, oldMonitorResultList, callback) => {
            Api.monitorlistCheck(data).then(res => {
                if (res.success) {
                    let newMonitorResultList = [];
                    for (let i = 0; i < oldMonitorResultList.length; i++) {
                        const element = oldMonitorResultList[i];
                        if (element.id === data.id) {
                            element.auditStatus = data.auditStatus;
                            element.auditStatusName = data.auditStatusName;
                            element.auditStatusNameEn = data.auditStatusNameEn;
                            element.auditReason = data.auditReason
                        }
                        newMonitorResultList.push(element)
                    }
                    dispatch(actionCreator(UPDATE_MONITOR_RESULT_STATUS_SUCCESS, { newMonitorResultList }))
                } else {
                    message.info(res.msg)
                    dispatch(actionCreator(UPDATE_MONITOR_RESULT_STATUS_ERROR, { oldMonitorResultList }))
                }
                typeof callback === 'function' && callback()
            })
        },
        saveExcelData: (data) => {
            Api.createExportExcel(data).then(res => {
                if (res.success) {
                    message.info(res.msg)
                } else {
                    message.error(res.msg)
                }
            })
        },
        // 获取志愿者列表
        getVolunteerList: data => {
            if (!data || !data.nameOrMobile) {
                dispatch(actionCreator(GET_VOLUNTEER_LIST_ERROR, { volunteerList: [] }))
            } else {
                Api.queryVolunterrList(data).then(res => {
                    if (res.success) {
                        dispatch(actionCreator(GET_VOLUNTEER_LIST_SUCCESS, { volunteerList: res.dataObject }))
                    } else {
                        dispatch(actionCreator(GET_VOLUNTEER_LIST_ERROR, { volunteerList: [] }))
                        message.error(res.msg)
                    }
                })
            }
        },
        // 分配任务
        distributeMonitorResult: (data, callback) => {
            Api.distributeMonitorResult(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback()
                } else {
                    message.info(res.msg)
                }
            })
        },
        // 查找待分配的数量
        queryMonitorPendingCount: data => {
            dispatch(actionCreator(GET_MONITOR_RESULT_PENDING_COUNT, { searchFetch: true }))
            Api.queryMonitorPendingCount(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_MONITOR_RESULT_PENDING_COUNT, { pendingTotal: res.dataObject, searchFetch: false }))
                } else {
                    dispatch(actionCreator(GET_MONITOR_RESULT_PENDING_COUNT, { pendingTotal: 0, searchFetch: false }))
                }
            })
        },
        // 取消分配任务
        cancelDistributeMonitorResult: (data, oldMonitorResultList) => {
            Api.cancelDistributeMonitorResult(data).then(res => {
                if (res.success) {
                    let newMonitorResultList = [];
                    for (let i = 0; i < oldMonitorResultList.length; i++) {
                        const element = oldMonitorResultList[i];
                        if (element.id === data.id) {
                            element.auditStatus = data.auditStatus;
                            element.auditStatusName = data.auditStatusName;
                            element.auditStatusNameEn = data.auditStatusNameEn;
                        }
                        newMonitorResultList.push(element)
                    }
                    dispatch(actionCreator(UPDATE_MONITOR_RESULT_STATUS_SUCCESS, { newMonitorResultList }))
                } else {
                    message.info(res.msg)
                    dispatch(actionCreator(UPDATE_MONITOR_RESULT_STATUS_ERROR, { oldMonitorResultList }))
                }
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
        },
        getAllWaitCount: (data, callback) => {
            Api.monitorChooseCount(data).then(res => {
                if (res.success) {
                    typeof callback === 'function' && callback(res)
                } else {
                    message.info(res.msg)
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MonitorResultList))
