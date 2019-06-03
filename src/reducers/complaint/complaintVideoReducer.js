import { GET_VIDEO_LIST_SUCCESS } from '../../contants/complaint/videoListTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_VIDEO_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                total: action.total !== undefined ? action.total : state.total,
                searchData: action.searchData,
                complaintVideoList: action.complaintVideoList,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
            })
        default:
            return state
    }
}