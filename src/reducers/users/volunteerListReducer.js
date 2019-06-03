import { GET_VOLUNTEER_LIST_SUCCESS, UPDATE_VOLUNTEER_STATUS_SUCCESS, UPDATE_VOLUNTEER_STATUS_ERROR } from '../../contants/users/volunteerListTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_VOLUNTEER_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldVolunteerList: action.oldVolunteerList,
                newVolunteerList: action.newVolunteerList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        case UPDATE_VOLUNTEER_STATUS_SUCCESS:
            return Object.assign({}, state, {
                newVolunteerList: action.newVolunteerList
            })
        case UPDATE_VOLUNTEER_STATUS_ERROR:
            return Object.assign({}, state, {
                newVolunteerList: action.oldVolunteerList
            })
        default:
            return state
    }
}