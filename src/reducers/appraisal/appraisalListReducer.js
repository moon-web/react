import { GET_APPRAISAL_LIST_SUCCESS, UPDATE_APPRAISAL_LIST_SUCCESS, UPDATE_APPRAISAL_LIST_ERROR } from '../../contants/appraisal/appraisalListTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_APPRAISAL_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldAppraisalList: action.oldAppraisalList,
                newAppraisalList: action.newAppraisalList,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
		case UPDATE_APPRAISAL_LIST_SUCCESS:
			return Object.assign({}, state, {
				newAppraisalList: action.newAppraisalList
			})
		case UPDATE_APPRAISAL_LIST_ERROR:
			return Object.assign({}, state, {
				oldAppraisalList: action.oldAppraisalList
			})
		default:
			return state
    }
}