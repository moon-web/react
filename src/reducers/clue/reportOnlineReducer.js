import { GET_ONLINE_REPORT_SUCCESS, UPDATE_ONLINE_REPORT_SUCCESS, UPDATE_ONLINE_REPORT_ERROR} from '../../contants/clue/reportOnlineTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_ONLINE_REPORT_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldReportOnlineList: action.oldReportOnlineList,
                newReportOnlineList: action.newReportOnlineList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
            case UPDATE_ONLINE_REPORT_SUCCESS:
                return Object.assign({}, state, {
                    newReportOnlineList: action.newReportOnlineList
                })
            case UPDATE_ONLINE_REPORT_ERROR:
                return Object.assign({}, state, {
                    oldReportOnlineList: action.oldReportOnlineList
                })
            default:
                return state
    }
}