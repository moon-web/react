
import { GET_REPORT_STATISTIC_SUCCESS ,GET_REPORT_BRANDINFO_SUCCESS, GET_REPORT_BRANDINFO_REEOR,GET_REPORT_COUNT_SUCCESS} from '../../contants/report/volunteerTaskTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_REPORT_STATISTIC_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                reportStatisticList: action.reportStatisticList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case GET_REPORT_BRANDINFO_SUCCESS:
            return Object.assign({}, state, {
                deliverTarget: action.deliverTarget,
                deliverUnitStr: action.deliverUnitStr,
                startDateStr: action.startDateStr,
                endDateStr: action.endDateStr,
                isBlock: action.isBlock,
            })
        case GET_REPORT_BRANDINFO_REEOR:
            return Object.assign({}, state, {
                deliverTarget: action.deliverTarget,
                deliverUnitStr: action.deliverUnitStr,
                startDateStr: action.startDateStr,
                endDateStr: action.endDateStr,
                isBlock: action.isBlock,
            })
        case GET_REPORT_COUNT_SUCCESS:
            return Object.assign({}, state, {
                vSuccNum: action.vSuccNum,
                vTotalNum: action.vTotalNum,
            })
        default:
            return state
    }
}