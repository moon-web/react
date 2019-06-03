import { GET_BRABD_OFFLINE_CASE_LIST_SUCCESS, UPDATE_BRABD_OFFLINE_CASE_SUCCESS, UPDATE_BRABD_OFFLINE_CASE_ERROR } from '../../contants/offlineCase/brandOfflineCaseTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_BRABD_OFFLINE_CASE_LIST_SUCCESS:
            return Object.assign({}, state, {
                oldBrandOfflineCaseList: action.oldBrandOfflineCaseList, 
                newBrandOfflineCaseList: action.newBrandOfflineCaseList, 
				isFetch: action.isFetch,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
                searchData: action.searchData
            })  
        case UPDATE_BRABD_OFFLINE_CASE_SUCCESS : 
            return Object.assign({}, state, {
                newBrandOfflineCaseList: action.newBrandOfflineCaseList
            })  
        case UPDATE_BRABD_OFFLINE_CASE_ERROR : 
            return Object.assign({}, state, {
                oldBrandOfflineCaseList: action.oldBrandOfflineCaseList
            })  
        default:
            return state
    }
}