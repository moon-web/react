import { GET_MONITOR_RESULT_LIST_SUCCESS, UPDATE_MONITOR_RESULT_STATUS_SUCCESS, UPDATE_MONITOR_RESULT_STATUS_ERROR, 
    GET_VOLUNTEER_LIST_SUCCESS, GET_VOLUNTEER_LIST_ERROR, GET_MONITOR_RESULT_PENDING_COUNT, GET_AUDIT_PROD_LIST_SUCCESS, GET_REPORT_TYPE_LIST_SUCCESS, GET_PROD_URL_LIST_SUCCESS } from '../../contants/monitoring/monitorResultListTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_MONITOR_RESULT_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldMonitorResultList: action.oldMonitorResultList,
                newMonitorResultList: action.newMonitorResultList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                total: action.total !== undefined ? action.total : state.total,
                searchData: action.searchData
            })
        case UPDATE_MONITOR_RESULT_STATUS_SUCCESS:
            return Object.assign({}, state, {
                newMonitorResultList: action.newMonitorResultList
            })
        case UPDATE_MONITOR_RESULT_STATUS_ERROR:
            return Object.assign({}, state, {
                newMonitorResultList: action.oldMonitorResultList
            })
        case GET_VOLUNTEER_LIST_SUCCESS:
            return Object.assign({}, state, {
                volunteerList: action.volunteerList
            })
        case GET_VOLUNTEER_LIST_ERROR:
            return Object.assign({}, state, {
                volunteerList: []
            })
        case GET_PROD_URL_LIST_SUCCESS:
            return Object.assign({}, state, {
                prodUrlList: action.prodUrlList
            })
        case GET_MONITOR_RESULT_PENDING_COUNT:
            return Object.assign({}, state, {
                pendingTotal: action.pendingTotal,
                searchFetch: action.searchFetch
            })
        case GET_AUDIT_PROD_LIST_SUCCESS:
            return Object.assign({}, state, {
                auditProdList: action.auditProdList
            })
        case GET_REPORT_TYPE_LIST_SUCCESS:
            return Object.assign({}, state, {
                auditreportTypeList: action.auditreportTypeList
            })  
        default:
            return state
    }
}