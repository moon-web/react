import { GET_REPORT_LIST_SUCCESS, UPDATE_REPORT_STATUS_SUCCESS, UPDATE_REPORT_STATUS_ERROR, GET_REPORT_TYPE_LIST, GET_REPORT_STORE_LIST_SUCCESS } from '../../contants/report/volunteerReportTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_REPORT_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldReportList: action.oldReportList,
                newReportList: action.newReportList,
                shopPageNo: action.shopPageNo !== undefined ? action.shopPageNo : state.shopPageNo,
                shopTotal: action.shopTotal !== undefined ? action.shopTotal : state.shopTotal,
                searchData: action.searchData,
            })
        case UPDATE_REPORT_STATUS_SUCCESS:
            return Object.assign({}, state, {
                newReportList: action.newReportList
            })
        case UPDATE_REPORT_STATUS_ERROR:
            return Object.assign({}, state, {
                newReportList: action.oldReportList
            })
        case GET_REPORT_STORE_LIST_SUCCESS:
            return Object.assign({}, state, {
                oldReportStoreList: action.oldReportStoreList,
                newReportStoreList: action.newReportStoreList,
                storePageNo: action.storePageNo !== undefined ? action.storePageNo : state.storePageNo,
                storeTotal: action.storeTotal !== undefined ? action.storeTotal : state.storeTotal,
            })
        case GET_REPORT_TYPE_LIST:
            return Object.assign({}, state, {
                reportType: action.reportType
            })      
        default:
            return state
    }
}