import { GET_BRAND_CONFIRMATION_LIST_SUCCESS, UPDATE_BRAND_CONFIRMATION_SUCCESS, UPDATE_BRAND_CONFIRMATION_ERROR} from '../../contants/brand/brandConfirmationTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_BRAND_CONFIRMATION_LIST_SUCCESS:
            return Object.assign({}, state, {
                newBrandConfirmationList: action.newBrandConfirmationList,
                oldBrandConfirmationList: action.oldBrandConfirmationList,
				isFetch: action.isFetch,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
			})
		case UPDATE_BRAND_CONFIRMATION_SUCCESS: 
			return Object.assign({}, state, {
				newBrandConfirmationList: action.newBrandConfirmationList,
			})
		case UPDATE_BRAND_CONFIRMATION_ERROR: 
			return Object.assign({}, state, {
				oldBrandConfirmationList: action.oldBrandConfirmationList
            })
        default:
            return state
    }
}