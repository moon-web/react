import { GET_REWORD_LIST_SUCCESS ,GET_REWORD_STATUS_SUCCESS, GET_REWORD_STATUS_ERROR} from '../../contants/investigationreport/rewardTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_REWORD_LIST_SUCCESS:
            return Object.assign({}, state, {
                oldRewordList:action.oldRewordList,
                newRewordList:action.newRewordList,
				isFetch: action.isFetch,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case GET_REWORD_STATUS_SUCCESS:
            return Object.assign({}, state, {
                newRewordList:action.newRewordList
            })
        case GET_REWORD_STATUS_ERROR:
            return Object.assign({}, state, {
                oldRewordList:action.oldRewordList
            })
        default:
            return state
    }
}
