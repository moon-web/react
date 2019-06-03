import { GET_VERSION_LIST_SUCCESS, UPDATE_VERSION_LIST_SUCCESS, UPDATE_VERSION_LIST_ERROR} from '../../contants/system/versionTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_VERSION_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldVersionList: action.oldVersionList,
                newVersionList: action.newVersionList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            }) 
        case UPDATE_VERSION_LIST_SUCCESS:
            return Object.assign({}, state, {
                newVersionList: action.newVersionList
            }) 
        case UPDATE_VERSION_LIST_ERROR:
            return Object.assign({}, state, {
                oldVersionList: action.oldVersionList
            }) 
        default:
            return state
    }
}