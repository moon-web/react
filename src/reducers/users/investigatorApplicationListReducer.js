import { GET_INVESTIGATION_APPLICATION_LIST_SUCCESS, UPDATE_INVESTIGATION_APPLICATION_STATUS_SUCCESS, UPDATE_INVESTIGATION_APPLICATION_STATUS_ERROR } from '../../contants/users/investigationApplicationListTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_INVESTIGATION_APPLICATION_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldInvestigationApplicationList: action.oldInvestigationApplicationList,
                newInvestigationApplicationList: action.newInvestigationApplicationList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case UPDATE_INVESTIGATION_APPLICATION_STATUS_SUCCESS:
            return Object.assign({}, state, {
                newInvestigationApplicationList: action.newInvestigationApplicationList
            })
        case UPDATE_INVESTIGATION_APPLICATION_STATUS_ERROR:
            return Object.assign({}, state, {
                newInvestigationApplicationList: action.oldInvestigationApplicationList
            })
        default:
            return state
    }
}