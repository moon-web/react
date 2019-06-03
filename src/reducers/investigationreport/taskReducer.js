
import { GET_INVESTIGATIONTASK_LIST_SUCCESS} from '../../contants/investigationreport/taskTypes'

export default function (state = {}, action) {
    switch (action.type) {
        case GET_INVESTIGATIONTASK_LIST_SUCCESS:
            return Object.assign({}, state, {
                isFetch: action.isFetch,
                oldInvestigationTaskList: action.oldInvestigationTaskList,
                newInvestigationTaskList: action.newInvestigationTaskList,
                search: action.search,
                pageNo: action.pageNo !== undefined ? action.pageNo : state.pageNo,
                pageSize: action.pageSize !== undefined ? action.pageSize : state.pageSize,
                total: action.total !== undefined ? action.total : state.total,
            })
        default:
            return state
    }
}