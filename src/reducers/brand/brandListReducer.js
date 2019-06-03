import { GET_BRAND_LISTDATA_SUCCESS ,UPDATE_BRAND_LIST_EDIT_ERROR,UPDATE_BRAND_LIST_EIDT_SUCCESS, GET_BRAND_EDIT_DETAIL_SUCCESS} from '../../contants/brand/brandListTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_BRAND_LISTDATA_SUCCESS:
            return Object.assign({}, state, {
                oldbrandListData: action.oldbrandListData,
                newbrandListData:action.newbrandListData,
                isFetch: action.isFetch,       
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case UPDATE_BRAND_LIST_EIDT_SUCCESS:{
            return Object.assign({}, state, {
				newbrandListData: action.newbrandListData,
            })
        }
        case UPDATE_BRAND_LIST_EDIT_ERROR:{
            return Object.assign({}, state, {
				oldbrandListData: action.oldbrandListData,
            })
        }
        case GET_BRAND_EDIT_DETAIL_SUCCESS: {
            return Object.assign({}, state, {
				brandEditDetail: action.brandEditDetail,
            })
        }
        default:
            return state
    }
}