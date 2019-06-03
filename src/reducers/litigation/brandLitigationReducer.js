import { GET_BRAND_LITIGATION_LIST_SUCCESS, UPDATE_BRAND_LITIGATION_ALLOT_LIST_SUCCESS, UPDATE_BRAND_LITIGATION_ALLOT_LIST_ERROR } from '../../contants/litigation/litigationTypes.js'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_BRAND_LITIGATION_LIST_SUCCESS : 
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldBrandLigiationList: action.oldBrandLigiationList,
                newBrandLigiationList: action.newBrandLigiationList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case UPDATE_BRAND_LITIGATION_ALLOT_LIST_SUCCESS: 
            return Object.assign({}, state, {
                newBrandLigiationList: action.newBrandLigiationList
            })
        case UPDATE_BRAND_LITIGATION_ALLOT_LIST_ERROR: 
            return Object.assign({}, state, {
                oldBrandLigiationList: action.oldBrandLigiationList
            })
            
        default:
            return state
    }
}