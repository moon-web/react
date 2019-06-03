import { GET_OFF_LINE_SUCCESS, UPDATE_OFF_LINE_SUCCESS, UPDATE_OFF_LINE_ERROR} from '../../contants/clue/offlineTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_OFF_LINE_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldOffLineList: action.oldOffLineList,
                newOffLineList: action.newOffLineList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
            case UPDATE_OFF_LINE_SUCCESS:
                return Object.assign({}, state, {
                    newOffLineList: action.newOffLineList
                })
            case UPDATE_OFF_LINE_ERROR:
                return Object.assign({}, state, {
                    oldOffLineList: action.oldOffLineList
                })
            default:
                return state
    }
}