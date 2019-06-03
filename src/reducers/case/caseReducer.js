import { GET_CASE_LIST_SUCCESS } from '../../contants/case/caseListTypes'

export default function (state = {}, action) {
    switch (action.type) {
		case GET_CASE_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldCaseList: action.oldCaseList,
                newCaseList: action.newCaseList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        default:
            return state
    }
}