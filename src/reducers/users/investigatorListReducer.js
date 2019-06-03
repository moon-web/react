import { GET_INVESTIGATION_LIST_SUCCESS, 
    UPDATE_INVESTIGATION_STATUS_SUCCESS, 
    UPDATE_INVESTIGATION_STATUS_ERROR, 
    GET_INVESTIGATION_DETAIL_SUCCESS, 
    UPDATE_INVESTIGATION_DETAIL_STATUS_SUCCESS, 
    UPDATE_INVESTIGATION_DETAIL_STATUS_ERROR, 
    GET_INVESTIGATION_COMPANY_DETAIL_SUCCESS,
    UPDATE_INVESTIGATION_COMPANY_DETAIL_STATUS_SUCCESS,
    UPDATE_INVESTIGATION_COMPANY_DETAIL_STATUS_ERROR
} from '../../contants/users/investigationListTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_INVESTIGATION_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldInvestigationList: action.oldInvestigationList,
                newInvestigationList: action.newInvestigationList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case UPDATE_INVESTIGATION_STATUS_SUCCESS:
            return Object.assign({}, state, {
                newInvestigationList: action.newInvestigationList
            })
        case UPDATE_INVESTIGATION_STATUS_ERROR:
            return Object.assign({}, state, {
                newInvestigationList: action.oldInvestigationList
            })
        case GET_INVESTIGATION_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                detail: action.detail
            })
        case UPDATE_INVESTIGATION_DETAIL_STATUS_SUCCESS:
            return Object.assign({}, state, {
                detail: action.detail,
                newInvestigationList: action.newInvestigationList
            })
        case UPDATE_INVESTIGATION_DETAIL_STATUS_ERROR:
            return Object.assign({}, state, {
                detail: action.detail,
                newInvestigationList: action.oldInvestigationList
            })
        case GET_INVESTIGATION_COMPANY_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                companyDetail: action.companyDetail
            })
        case UPDATE_INVESTIGATION_COMPANY_DETAIL_STATUS_SUCCESS:
            return Object.assign({}, state, {
                companyDetail: action.companyDetail,
                newInvestigationList: action.newInvestigationList
            })
        case UPDATE_INVESTIGATION_COMPANY_DETAIL_STATUS_ERROR:
            return Object.assign({}, state, {
                companyDetail: action.companyDetail,
                newInvestigationList: action.oldInvestigationList
            })
        default:
            return state
    }
}