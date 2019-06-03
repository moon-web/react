
import { GET_CATEGORY_LIST_SUCCESS, UPDATE_CATEGORY_LIST_SUCCESS, UPDATE_CATEGORY_LIST_ERROR} from '../../contants/system/categoryListTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_CATEGORY_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldCategoryList: action.oldCategoryList,
                newCategoryList: action.newCategoryList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case UPDATE_CATEGORY_LIST_SUCCESS:
            return Object.assign({}, state, {
                newCategoryList: action.newCategoryList
            })
        case UPDATE_CATEGORY_LIST_ERROR:
            return Object.assign({}, state, {
                oldCategoryList: action.oldCategoryList
            })
        default:
            return state
    }
}