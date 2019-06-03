import { GET_SCRIPT_LOG_LIST_SUCCESS, GET_SCRIPT_LOG_LIST_ERROR, UPDATE_SCRIPT_LOG_LIST_SUCCESS, UPDATE_SCRIPT_LOG_LIST_ERROR } from '../../contants/system/scriptLogListTypes'
const initState = {
    isFetch: false,
    oldScriptLogList: [],
    newScriptLogList: [],
    pageNo: 1,
    total: 0
}

export default function (state = initState, action) {
    switch (action.type) {
        case GET_SCRIPT_LOG_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldScriptLogList: action.oldScriptLogList,
                newScriptLogList: action.newScriptLogList,
                pageNo: action.pageNo === undefined ? 1 : action.pageNo,
                total: action.total
            })
        case GET_SCRIPT_LOG_LIST_ERROR:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                newScriptLogList: action.oldScriptLogList,
                pageNo: action.pageNo === undefined ? 1 : action.pageNo - 1,
                total: action.total
            })
        case UPDATE_SCRIPT_LOG_LIST_SUCCESS:
            return Object.assign({}, state, {
                newScriptLogList: action.newScriptLogList,
            })
        case UPDATE_SCRIPT_LOG_LIST_ERROR:
            return Object.assign({}, state, {
                newScriptLogList: action.oldScriptLogList,
            })
        default:
            return state
    }
}