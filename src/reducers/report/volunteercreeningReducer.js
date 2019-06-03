import { GET_VOLUNTEER_SCREEN_LIST_SUCCESS, UPDATE_VOLUNTEER_SCREEN_SUCCESS, UPDATE_VOLUNTEER_SCREEN_ERROR, GET_VOLUNTEER_SCREEN_STORE_LIST_SUCCESS} from '../../contants/report/volunteercreeningTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_VOLUNTEER_SCREEN_LIST_SUCCESS:
            return Object.assign({}, state, {
                newVolunteerScreen: action.newVolunteerScreen,
                oldVolunteerScreen: action.oldVolunteerScreen,
				isFetch: action.isFetch,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
                searchData: action.searchData
            })         
        case GET_VOLUNTEER_SCREEN_STORE_LIST_SUCCESS:
            return Object.assign({}, state, {
                oldVolunteerScreenStoreList: action.oldVolunteerScreenStoreList,
                newVolunteerScreenStoreList: action.newVolunteerScreenStoreList,
                storePageNo: action.storePageNo !== undefined ? action.storePageNo : state.storePageNo,
                storeTotal: action.storeTotal !== undefined ? action.storeTotal : state.storeTotal,
            })
		case UPDATE_VOLUNTEER_SCREEN_SUCCESS: 
			return Object.assign({}, state, {
				newVolunteerScreen: action.newVolunteerScreen,
			})
		case UPDATE_VOLUNTEER_SCREEN_ERROR: 
			return Object.assign({}, state, {
				oldVolunteerScreen: action.oldVolunteerScreen
            })
        default:
            return state
    }
}