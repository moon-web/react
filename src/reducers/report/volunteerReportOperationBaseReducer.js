import {
    GET_REPORT_BASE_SCREEN_LIST_SUCCESS, UPDATE_REPORT_BASE_SCREEN_LIST_SUCCESS, UPDATE_REPORT_BASE_SCREEN_LIST_ERROR
} from '../../contants/report/volunteerReportTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_REPORT_BASE_SCREEN_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldoperationBaseList: action.oldoperationBaseList,
                newoperationBaseList: action.newoperationBaseList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                total: action.total !== undefined ? action.total : state.total,
                searchData: action.searchData,
            })
        case UPDATE_REPORT_BASE_SCREEN_LIST_SUCCESS:
            return Object.assign({}, state, {
                newoperationBaseList: action.newoperationBaseList,
            })
        case UPDATE_REPORT_BASE_SCREEN_LIST_ERROR:
            return Object.assign({}, state, {
                newoperationBaseList: action.oldoperationBaseList,
            })
        default:
            return state
    }
}