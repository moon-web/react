import { GET_REPORT_TASK_SUCCESS, UPDATE_REPORT_TASK_SUCCESS, UPDATE_REPORT_TASK_ERROR } from '../../contants/clue/reportTaskTypes'
export default function(state = {}, action) {
	switch (action.type) {
		case GET_REPORT_TASK_SUCCESS:
			return Object.assign({}, state, {
				isFatch: action.isFatch,
				oldReportTaskList: action.oldReportTaskList,
				newReportTaskList: action.newReportTaskList,
                searchData: action.searchData,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
			})
		case UPDATE_REPORT_TASK_SUCCESS:
			return Object.assign({}, state, {
				newReportTaskList: action.newReportTaskList
			})
		case UPDATE_REPORT_TASK_ERROR:
			return Object.assign({}, state, {
				oldReportTaskList: action.oldReportTaskList
			})
		default:
			return state
	}

}