import { GET_OFFLINE_REPORT_SUCCESS, UPDATE_OFFLINE_REPORT_SUCCESS, UPDATE_OFFLINE_REPORT_ERROR} from '../../contants/clue/reportOfflineTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_OFFLINE_REPORT_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldReportoffLineList: action.oldReportoffLineList,
                newReportoffLineList: action.newReportoffLineList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
            case UPDATE_OFFLINE_REPORT_SUCCESS:
                return Object.assign({}, state, {
                    newReportoffLineList: action.newReportoffLineList
                })
            case UPDATE_OFFLINE_REPORT_ERROR:
                return Object.assign({}, state, {
                    oldReportoffLineList: action.oldReportoffLineList
                })
            default:
                return state
    }
}