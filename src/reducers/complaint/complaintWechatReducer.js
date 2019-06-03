import { GET_WECHAT_LIST_SUCCESS } from '../../contants/complaint/wechatListTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_WECHAT_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                WechartcomplainList: action.WechartcomplainList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        default:
            return state
    }
}