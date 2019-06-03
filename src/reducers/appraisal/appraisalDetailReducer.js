import { GET_APPRAISAL_DETAIL_SUCCESS } from '../../contants/appraisal/appraisalDetailTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_APPRAISAL_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                appraisalDetailList: action.appraisalDetailList
            })
		default:
			return state
    }
}