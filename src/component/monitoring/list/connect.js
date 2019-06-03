import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import MonitorList from './index'
import { actionCreator, union } from '../../../utils/util'
import { GET_MONITOR_LIST_SUCCESS, UPDATE_MONITOR_STATUS_SUCCESS, UPDATE_MONITOR_STATUS_ERROR } from '../../../contants/monitoring/monitorListTypes'
import Api from '../../../api/index'

function mapStateToProps(state, props) {
    // 属性 
    const { isFetch, oldMonitorListResult, newMonitorListResult, pageNo, searchData, pageSize = 10, total } = state.monitorListReducer;
    const monitorList = union(oldMonitorListResult, newMonitorListResult)
    const { brandList, permissionList, monitorRulesTaskStatus} = state.commonReducer;
    const userInfo = state.loginReducer.userInfo || {};
    return {
        isFetch,
        monitorList,
        searchData,
        pageNo,
        pageSize,
        total,
        brandList,
        userInfo,
        permissionList,
        monitorRulesTaskStatus
    }
}

function mapDispatchToProps(dispatch, props) {
    // 方法
    return {
        // 获取列表
        getMonitorList: (oldMonitorList, data) => {
            let searchData = {
                monitorNameLike: data.monitorNameLike,
                ownedBrand: data.ownedBrand,
                monitorStatus: data.monitorStatus,
                monitorId: data.monitorId,
                startTime: data.startTime,
                endTime: data.endTime
            }
            dispatch(actionCreator(GET_MONITOR_LIST_SUCCESS, { isFetch: true }))
            Api.monitoring(data).then(res => {
                if (res.success) {
                    dispatch(actionCreator(GET_MONITOR_LIST_SUCCESS, { oldMonitorList, newMonitorList: res.result || [], pageNo: data.pageNo, pageSize: data.pageSize, searchData, total: res.records, isFetch: false }))
                }
            })
        },
        // 更新列表数据
        changeMonitorToAgain: (data, oldMonitorList, callback) => {
            Api.changeMonitorToAgain(data).then(res => {
                if (res.success) {
                    let newMonitorList = [];
                    for (let i = 0; i < oldMonitorList.length; i++) {
                        const element = oldMonitorList[i];
                        if (element.monitorId === data.monitorId) {
                            if (data.monitorStatus === 1) {
                                element.monitorStatus = 2;
                                element.monitorStatusName = data.monitorStatusName;
                                element.monitorStatusNameEn = data.monitorStatusNameEn;
                            } else if (data.monitorStatus === 2) {
                                element.monitorStatus = 1;
                                element.monitorStatusName = data.monitorStatusName;
                                element.monitorStatusNameEn = data.monitorStatusNameEn;
                            }
                        }
                        newMonitorList.push(element)
                    }
                    typeof callback === 'function' && callback()
                    dispatch(actionCreator(UPDATE_MONITOR_STATUS_SUCCESS, { newMonitorList }))
                } else {
                    dispatch(actionCreator(UPDATE_MONITOR_STATUS_ERROR, { oldMonitorList }))
                }
            })
        },

        // 更新列表数据
        changeMonitorToEnd: (data, oldMonitorList, callback) => {
            Api.changeMonitorToEnd(data).then(res => {
                if (res.success) {
                    let newMonitorList = [];
                    for (let i = 0; i < oldMonitorList.length; i++) {
                        const element = oldMonitorList[i];
                        if (element.monitorId === data.monitorId) {
                            if (data.monitorStatus === 1) {
                                element.monitorStatus = 2;
                            } else if (data.monitorStatus === 2) {
                                element.monitorStatus = 1;
                            }
                        }
                        newMonitorList.push(element)
                    }
                    typeof callback === 'function' && callback()
                    dispatch(actionCreator(UPDATE_MONITOR_STATUS_SUCCESS, { newMonitorList }))
                } else {
                    dispatch(actionCreator(UPDATE_MONITOR_STATUS_ERROR, { oldMonitorList }))
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MonitorList))
