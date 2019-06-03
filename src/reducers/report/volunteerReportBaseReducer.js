import {
    GET_REPORT_BASE_LIST_SUCCESS, UPDATE_REPORT_BASE_LIST_SUCCESS, UPDATE_REPORT_BASE_LIST_ERROR
} from '../../contants/report/volunteerReportTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_REPORT_BASE_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldReportBaseList: action.oldReportBaseList,
                newReportBaseList: action.newReportBaseList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                total: action.total !== undefined ? action.total : state.total,
                searchData: action.searchData,
            })
        case UPDATE_REPORT_BASE_LIST_SUCCESS:
            return Object.assign({}, state, {
                newReportBaseList: action.newReportBaseList,
            })
        case UPDATE_REPORT_BASE_LIST_ERROR:
            return Object.assign({}, state, {
                newReportBaseList: action.oldReportBaseList,
            })
        default:
            return state
    }
}