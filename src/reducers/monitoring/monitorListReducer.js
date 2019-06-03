import { GET_MONITOR_LIST_SUCCESS, UPDATE_MONITOR_STATUS_SUCCESS, UPDATE_MONITOR_STATUS_ERROR } from '../../contants/monitoring/monitorListTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_MONITOR_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldMonitorListResult: action.oldMonitorList,
                newMonitorListResult: action.newMonitorList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case UPDATE_MONITOR_STATUS_SUCCESS:
            return Object.assign({}, state, {
                newMonitorListResult: action.newMonitorList
            })
        case UPDATE_MONITOR_STATUS_ERROR:
            return Object.assign({}, state, {
                newMonitorListResult: action.oldMonitorList
            })
        default:
            return state
    }
}