
import { GET_OPLOGS_LIST_SUCCESS, GET_OPLOGS_LIST_ERROR } from '../../contants/system/oplogsTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_OPLOGS_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldOplogsList: action.oldOplogsList,
                newOplogsList: action.newOplogsList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                total: action.total !== undefined ? action.total : state.total,
            })
        case GET_OPLOGS_LIST_ERROR:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                newOplogsList: action.oldOplogsList
            })
        default:
            return state
    }
}