import { GET_INVESTIGATION_REPORT_DETAIL_SUCCESS ,GET_INVESTIGATION_DETAIL_TASKLOG_SUCCESS,GET_INVESTIGATION_DETAIL_USERINFO_SUCCESS} from '../../../contants/investigationreport/details/investigationDetailTypes'
export default function (state = {}, action) {
    switch (action.type) {
        case GET_INVESTIGATION_REPORT_DETAIL_SUCCESS:
            return Object.assign({}, state, {
				investigationDetail: action.investigationDetail,
            })
        case GET_INVESTIGATION_DETAIL_TASKLOG_SUCCESS:
            return Object.assign({},state, {
                investigationDetailTaskLog: action.investigationDetailTaskLog,
                pageNo:action.pageNo,
                total:action.total
            })
        case GET_INVESTIGATION_DETAIL_USERINFO_SUCCESS:
            return Object.assign({},state,{
                groupUserData:action.groupUserData
            })
        default:
            return state
    }
}