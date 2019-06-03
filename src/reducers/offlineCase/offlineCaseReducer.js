import { GET_OFFLINE_CASE_LIST_SUCCESS, UPDATE_OFFLINE_LIST_STATUS_SUCCESS, UPDATE_OFFLINE_LIST_STATUS_ERROR } from '../../contants/offlineCase/offlineCaseTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_OFFLINE_CASE_LIST_SUCCESS:
            return Object.assign({}, state, {
                oldOfflineCaseList: action.oldOfflineCaseList, 
                newOfflineCaseList: action.newOfflineCaseList, 
				isFetch: action.isFetch,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
                searchData: action.searchData
            })   
        case UPDATE_OFFLINE_LIST_STATUS_SUCCESS : 
            return Object.assign({}, state, {
                newOfflineCaseList: action.newOfflineCaseList
            })  
        case UPDATE_OFFLINE_LIST_STATUS_ERROR : 
            return Object.assign({}, state, {
                oldOfflineCaseList: action.oldOfflineCaseList
            }) 
        default:
            return state
    }
}