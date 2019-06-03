import { GET_ON_LINE_SUCCESS, UPDATE_ON_LINE_SUCCESS, UPDATE_ON_LINE_ERROR} from '../../contants/clue/onlineTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_ON_LINE_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldOnlineList: action.oldOnlineList,
                newOnlineList: action.newOnlineList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
            case UPDATE_ON_LINE_SUCCESS:
                return Object.assign({}, state, {
                    newOnlineList: action.newOnlineList
                })
            case UPDATE_ON_LINE_ERROR:
                return Object.assign({}, state, {
                    oldOnlineList: action.oldOnlineList
                })
            default:
                return state
    }
}