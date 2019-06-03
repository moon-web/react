
import { GET_INVESTIGATIONREPORT_LIST_SUCCESS,GET_DISTRIBUTION_LIST_SUCCESS,
    GET_INVESTIGATIONREPORT_TOEXAMINE_SUCCESS,GET_INVESTIGATIONREPORT_TOEXAMINE_ERROR,
    GET_INVESTIGATIONREPORT_DISTRIBUTION_SUCCESS,GET_INVESTIGATIONREPORT_DISTRIBUTION_ERROR
} from '../../contants/investigationreport/reportTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_INVESTIGATIONREPORT_LIST_SUCCESS:
            return Object.assign({}, state, {
                search:action.search,
                isFetch: action.isFetch,
                oldInvestigationReportList: action.oldInvestigationReportList,
                newInvestigationReportList: action.newInvestigationReportList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case GET_DISTRIBUTION_LIST_SUCCESS:
            return Object.assign({}, state, {
                getDistributionList: action.getDistributionList,
                minPageNo:action.minPageNo,
                minPageSize:action.minPageSize,
                minTotal:action.minTotal
            })
        case GET_INVESTIGATIONREPORT_TOEXAMINE_SUCCESS:
            return Object.assign({}, state, {
                newInvestigationReportList: action.newInvestigationReportList,
            })
        case GET_INVESTIGATIONREPORT_TOEXAMINE_ERROR:
            return Object.assign({}, state, {
                oldInvestigationReportList: action.oldInvestigationReportList,
            })
        case GET_INVESTIGATIONREPORT_DISTRIBUTION_SUCCESS:
            return Object.assign({}, state, {
                newInvestigationReportList: action.newInvestigationReportList,
            })    
        case GET_INVESTIGATIONREPORT_DISTRIBUTION_ERROR:
            return Object.assign({}, state, {
                oldInvestigationReportList: action.oldInvestigationReportList,
            })
        default:
            return state
    }
}