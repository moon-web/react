
import { GET_DICTONARY_LIST_SUCCESS, GET_DICTONARY_TYPE_DATA, UPDATE_DICTONARY_LIST_SUCCESS, UPDATE_DICTONARY_LIST_ERROR} from '../../contants/system/dictonaryListTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_DICTONARY_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldDictionaryList: action.oldDictionaryList,
                newDictionaryList: action.newDictionaryList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case GET_DICTONARY_TYPE_DATA:
            return Object.assign({}, state, {
                dictonaryType: action.dictonaryType
            })
        case UPDATE_DICTONARY_LIST_SUCCESS:
            return Object.assign({}, state, {
                newDictionaryList: action.newDictionaryList
            })
        case UPDATE_DICTONARY_LIST_ERROR:
            return Object.assign({}, state, {
                oldDictionaryList: action.oldDictionaryList
            })
        default:
            return state
    }
}