import { GET_REPORTTASK_DETAILS_SUCCESS } from '../../contants/clue/reportTaskDetail'
export default function(state = {}, action) {
	switch (action.type) {
		case GET_REPORTTASK_DETAILS_SUCCESS:
			return Object.assign({}, state, {
				reportTaskDetailsList: action.reportTaskDetailsList
			})
		default:
			return state
	}

}