import { GET_REPORT_APPLIVATION_SUCCESS, UPDATE_REPORT_APPLIVATION_SUCCESS, UPDATE_REPORT_APPLIVATION_ERROR} from '../../contants/clue/reportApplicationTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_REPORT_APPLIVATION_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldReportList: action.oldReportList,
                newReportList: action.newReportList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
            case UPDATE_REPORT_APPLIVATION_SUCCESS:
                return Object.assign({}, state, {
                    newReportList: action.newReportList
                })
            case UPDATE_REPORT_APPLIVATION_ERROR:
                return Object.assign({}, state, {
                    oldReportList: action.oldReportList
                })
            default:
                return state
    }
}