import { GET_LITIGATION_LIST_SUCCESS, UPDATE_LITIGATION_ALLOT_LIST_SUCCESS } from '../../contants/litigation/litigationTypes.js'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_LITIGATION_LIST_SUCCESS : 
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldLigiationList: action.oldLigiationList,
                newLigiationList: action.newLigiationList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case UPDATE_LITIGATION_ALLOT_LIST_SUCCESS: 
            return Object.assign({}, state, {
                newLigiationList: action.newLigiationList
            })
        default:
            return state
    }
}