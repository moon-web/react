import { GET_THREAD_LIST_SUCCESS, UPDATE_THREAD_LIST_SUCCESS, UPDATE_THREAD_LIST_ERROR,
    UPDATE_THREAD_CLASSIFICATION_SUCCESS, GET_THREAD_DETAILS } from '../../contants/thread/threadTypes.js'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_THREAD_LIST_SUCCESS : 
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldThreadList: action.oldThreadList,
                newThreadList: action.newThreadList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case UPDATE_THREAD_LIST_SUCCESS:
            return Object.assign({}, state, {
                newThreadList: action.newThreadList,
            })
        case UPDATE_THREAD_LIST_ERROR:
            return Object.assign({}, state, {
                oldThreadList: action.oldThreadList,
            })
        case UPDATE_THREAD_CLASSIFICATION_SUCCESS:
            return Object.assign({}, state, {
                newThreadList: action.newThreadList,
            })
        case GET_THREAD_DETAILS:
            return Object.assign({}, state, {
                queryThreadDetail: action.queryThreadDetail,
            })
        default:
            return state
    }
}