import { GET_SYSTEM_LIST_SUCCESS, UPDATE_SYSTEM_LIST_SUCCESS, UPDATE_SYSTEM_LIST_ERROR, GET_SYSTEM_ROLE_SUCCESS, GET_SYSTEM_ADD_SUCCESS } from '../../contants/system/systemListTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_SYSTEM_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldSyatemList: action.oldSyatemList,
                newSystemList: action.newSystemList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
		case UPDATE_SYSTEM_LIST_SUCCESS:
			return Object.assign({}, state, {
				newSystemList: action.newSystemList
			})
		case UPDATE_SYSTEM_LIST_ERROR:
			return Object.assign({}, state, {
				oldSyatemList: action.oldSyatemList
            })            
        case GET_SYSTEM_ROLE_SUCCESS:
            return Object.assign({}, state, {
                systemRoleList: action.systemRoleList
            })
        case GET_SYSTEM_ADD_SUCCESS:
            return Object.assign({}, state, {
                isFetchBtag: action.isFetchBtag
            })
            
		default:
			return state
    }
}