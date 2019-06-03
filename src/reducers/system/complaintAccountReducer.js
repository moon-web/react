import { GET_COMPLAINT_ACCOUNT_LIST_SUCCESS, UPDATE_COMPLAINT_ACCOUNT_SUCCESS, UPDATE_COMPLAINT_ACCOUNT_ERROR, GET_COMPLAINT_ACCOUNT_ADD_SUCCESS } from '../../contants/system/complaintAccountTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_COMPLAINT_ACCOUNT_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldComplaintAccountList: action.oldComplaintAccountList,
                newComplaintAccountList: action.newComplaintAccountList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
			})			
		case UPDATE_COMPLAINT_ACCOUNT_SUCCESS:
			return Object.assign({}, state, {
				newComplaintAccountList: action.newComplaintAccountList
		})
		case UPDATE_COMPLAINT_ACCOUNT_ERROR:
			return Object.assign({}, state, {
				oldComplaintAccountList: action.oldComplaintAccountList
            })
        case GET_COMPLAINT_ACCOUNT_ADD_SUCCESS:
			return Object.assign({}, state, {
				isFetchBtag: action.isFetchBtag
            })
            
        default:
            return state
    }
}