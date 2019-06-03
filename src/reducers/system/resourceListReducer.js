import { GET_RESOURCE_LIST_SUCCESS, GET_RESOURCE_BRAND_SUCCESS, GET_RESOURCE_FOR_BRAND_AND_TYPE,  GET_RESOURCE_BRAND_LIST_SUCCESS } from '../../contants/system/resourceListTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_RESOURCE_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldSourceList: action.oldSourceList,
                newSourceList: action.newSourceList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case GET_RESOURCE_BRAND_SUCCESS:
            return Object.assign({}, state, {
                resourceBrandList: action.resourceBrandList
            })
        case GET_RESOURCE_FOR_BRAND_AND_TYPE:
            return Object.assign({}, state, {
                resourceTraList: action.resourceTraList,
                resourceReasonList: action.resourceReasonList
            })
        case GET_RESOURCE_BRAND_LIST_SUCCESS:
            return Object.assign({}, state, {
                typeBrandList: action.typeBrandList
            })            
        default:
            return state
    }
}